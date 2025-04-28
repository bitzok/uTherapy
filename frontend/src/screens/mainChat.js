import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Image,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ChatScreen = ({ navigation }) => {
  const [messages, setMessages] = useState([
    { id: '1', text: '¡Hola! ¿Cómo estás?', fromMe: false },
    { id: '2', text: '¡Todo bien, gracias! ¿Y tú?', fromMe: true },
  ]);
  const [input, setInput] = useState('');
  const flatListRef = useRef();

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() === '') return;

    const userMessage = {
      id: Date.now().toString(),
      text: input,
      fromMe: true,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    // Mostrar burbuja de "escribiendo"
    const typingPlaceholder = {
      id: 'typing',
      text: 'uBot está escribiendo...',
      fromMe: false,
      isTyping: true,
    };
    setMessages((prev) => [...prev, typingPlaceholder]);

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer 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`, 
        },
        body: JSON.stringify({
          model: 'deepseek/deepseek-r1:free', 
          messages: [
            { role: 'system', content: 'Eres un asistente útil.' },
            { role: 'user', content: input }
          ],
          temperature: 0.7
        }),
      });
  
      if (!response.ok) {
        throw new Error('Error en la respuesta de DeepSeek');
      }
  
      const data = await response.json();
      const botMessage = data.choices[0].message.content;
  
      const botResponse = {
        id: Date.now().toString() + '_bot',
        text: botMessage,
        fromMe: false,
      };
  
      setMessages((prev) => [
        ...prev.filter((msg) => msg.id !== 'typing'),
        botResponse,
      ]);
    } catch (error) {
      console.error(error);
      const errorMessage = {
        id: Date.now().toString() + '_error',
        text: 'Lo siento, hubo un error al conectar con uBot 🤖',
        fromMe: false,
      };
  
      setMessages((prev) => [
        ...prev.filter((msg) => msg.id !== 'typing'),
        errorMessage,
      ]);
    }

  };

  const renderItem = ({ item }) => {
    const isMe = item.fromMe;
    const isTyping = item.isTyping;

    return (
      <View style={[styles.messageRow, isMe ? styles.rowRight : styles.rowLeft]}>
        {!isMe && (
          <Image
            source={{ uri: 'https://i.pravatar.cc/100?img=8' }}
            style={styles.avatar}
          />
        )}
        <View
          style={[
            styles.messageBubble,
            isMe
              ? styles.myMessage
              : isTyping
              ? styles.typingBubbleBackground
              : styles.otherMessage,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isTyping ? styles.typingBubbleText : null,
            ]}
          >
            {item.text}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#FF804C" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
        keyboardVerticalOffset={80}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation?.goBack?.()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>uBot</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Chat */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messageContainer}
        />

        {/* Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={input}
            onChangeText={setInput}
            placeholder="Escribe un mensaje..."
            placeholderTextColor="#999"
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Text style={styles.sendButtonText}>Enviar</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FF804C',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 60,
    backgroundColor: '#FF804C',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  messageContainer: {
    padding: 10,
    paddingBottom: 20,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: 5,
  },
  rowRight: {
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
  },
  rowLeft: {
    alignSelf: 'flex-start',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 10,
    borderRadius: 10,
  },
  myMessage: {
    backgroundColor: '#FFA982', // más claro que #FF804C
  },
  otherMessage: {
    backgroundColor: '#F1F1F1',
  },
  typingBubbleText: {
    fontStyle: 'italic',
    color: '#999',
  },
  messageText: {
    fontSize: 16,
    color: '#000',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#FFF5F0',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    color: '#333',
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#FF804C',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
