// Ask Tab - AI Chat Interface
// Following PRD: WhatsApp/iMessage style, context-aware
// Following .cursorrules: Show helpful messages, handle errors gracefully

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useChatStore } from '../stores/chatStore';
import { useTestStore } from '../stores/testStore';
import { useUserStore } from '../stores/userStore';
import { Colors, Spacing, Typography, BorderRadius } from '../constants/theme';
import { calculateReadyScore } from '../utils/readyScore';
import { calculateBioAge } from '../utils/bioAge';
import { lightTap } from '../utils/haptics';

export default function Ask() {
  const messages = useChatStore((state) => state.messages);
  const addMessage = useChatStore((state) => state.addMessage);
  const isLoading = useChatStore((state) => state.isLoading);
  const setLoading = useChatStore((state) => state.setLoading);
  
  const tests = useTestStore((state) => state.tests);
  const profile = useUserStore((state) => state.profile);
  
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  // Calculate current metrics for context
  const readyScore = calculateReadyScore(tests);
  const bioAge = profile ? calculateBioAge(tests, profile.birthYear) : null;

  // Suggested questions
  const suggestedQuestions = [
    "Why is my ReadyScore low today?",
    "What affects testosterone the most?",
    "Should I exercise today?",
    "Explain my BioAge calculation",
  ];

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage = inputText.trim();
    setInputText('');
    lightTap();

    // Add user message
    addMessage({
      role: 'user',
      content: userMessage,
    });

    // For MVP: Show placeholder response
    // In production: Call Claude API here
    setLoading(true);
    
    setTimeout(() => {
      const aiResponse = getPlaceholderResponse(userMessage);
      addMessage({
        role: 'assistant',
        content: aiResponse,
      });
      setLoading(false);
    }, 1000);
  };

  const handleSuggestedQuestion = (question: string) => {
    setInputText(question);
  };

  function getPlaceholderResponse(question: string): string {
    const lowerQ = question.toLowerCase();

    if (lowerQ.includes('readyscore')) {
      return `Your ReadyScore of ${readyScore.score} is ${readyScore.label.toLowerCase()}. This is based on your recent hormone levels, sleep quality, and recovery indicators. ${
        readyScore.score >= 80 
          ? "You're optimized for peak performance today!" 
          : readyScore.score >= 60
          ? "You're in good shape for steady-state activities."
          : "Focus on recovery today - your body needs rest."
      }`;
    }

    if (lowerQ.includes('bioage')) {
      if (bioAge) {
        return `Your BioAge is ${bioAge.biologicalAge} while your chronological age is ${bioAge.chronologicalAge}. ${
          bioAge.difference > 0
            ? `You're ${bioAge.difference} years younger biologically! 🎉`
            : bioAge.difference < 0
            ? `There's room for improvement - focus on hormone optimization.`
            : "Your biological and chronological ages align."
        } This is based on ${bioAge.basedOnTests} tests.`;
      }
      return "I need more test data to calculate your BioAge accurately. Log at least 3 tests to unlock this feature!";
    }

    if (lowerQ.includes('testosterone')) {
      return "Testosterone is optimized by: quality sleep (7-8 hours), resistance training, healthy fats, stress management, and adequate vitamin D. Your test history shows patterns - would you like me to analyze them?";
    }

    if (lowerQ.includes('exercise')) {
      if (readyScore.score >= 75) {
        return "Your ReadyScore suggests you're ready for intense exercise today. Your hormone levels support peak performance!";
      } else if (readyScore.score >= 60) {
        return "Moderate exercise like steady-state cardio would be ideal today. Avoid high-intensity training.";
      } else {
        return "Today is a recovery day. Light movement like walking or yoga is recommended.";
      }
    }

    return `I'm your hormone optimization coach! I can help you understand your ReadyScore (${readyScore.score}), BioAge${bioAge ? ` (${bioAge.biologicalAge})` : ''}, and hormone patterns. 

**Note**: AI chat is currently in demo mode. For full AI-powered insights, you'll need to add your Claude API key in settings.

Ask me about your specific hormone levels, patterns, or optimization strategies!`;
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={100}
    >
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.messagesContainer}
      >
        {/* Welcome message if no chat history */}
        {messages.length === 0 && (
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeIcon}>🤖</Text>
            <Text style={styles.welcomeTitle}>Hi! I'm your hormone coach</Text>
            <Text style={styles.welcomeText}>
              Ask me anything about your hormone levels, ReadyScore, or optimization strategies.
            </Text>
            
            <View style={styles.suggestedContainer}>
              <Text style={styles.suggestedTitle}>Suggested questions:</Text>
              {suggestedQuestions.map((question, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.suggestedButton}
                  onPress={() => handleSuggestedQuestion(question)}
                >
                  <Text style={styles.suggestedText}>{question}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Chat messages */}
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageBubble,
              message.role === 'user' ? styles.userBubble : styles.aiBubble,
            ]}
          >
            <Text
              style={[
                styles.messageText,
                message.role === 'user' ? styles.userText : styles.aiText,
              ]}
            >
              {message.content}
            </Text>
          </View>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <View style={[styles.messageBubble, styles.aiBubble]}>
            <Text style={styles.aiText}>...</Text>
          </View>
        )}
      </ScrollView>

      {/* Input bar */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Ask about your hormones..."
          placeholderTextColor={Colors.textSecondary}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!inputText.trim() || isLoading}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  messagesContainer: {
    padding: Spacing.md,
  },
  welcomeContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
  },
  welcomeIcon: {
    fontSize: 64,
    marginBottom: Spacing.lg,
  },
  welcomeTitle: {
    fontSize: Typography.xxl,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  welcomeText: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  suggestedContainer: {
    width: '100%',
    marginTop: Spacing.lg,
  },
  suggestedTitle: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  suggestedButton: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.button,
    marginBottom: Spacing.sm,
  },
  suggestedText: {
    fontSize: Typography.base,
    color: Colors.primary,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: Spacing.md,
    borderRadius: 16,
    marginBottom: Spacing.sm,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.primary,
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.surface,
  },
  messageText: {
    fontSize: Typography.base,
    lineHeight: Typography.normal * Typography.base,
  },
  userText: {
    color: Colors.white,
  },
  aiText: {
    color: Colors.textPrimary,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: Spacing.md,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.button,
    padding: Spacing.md,
    fontSize: Typography.base,
    color: Colors.textPrimary,
    maxHeight: 100,
    marginRight: Spacing.sm,
  },
  sendButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.button,
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: Colors.border,
  },
  sendButtonText: {
    color: Colors.white,
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
  },
});
