import { useState, useRef, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { chatWithSaad, predictWithSaad, chatWithAmmar, predictWithAmmar } from '../api/gradio.js'
import PrismExample from '../../PrismExample'
import './Chat.css'

function Chat() {
  const { twinName } = useParams()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    setIsLoading(true)

    // Add user message
    const newMessages = [...messages, { role: 'user', content: userMessage }]
    setMessages(newMessages)

    try {
      // ✅ Convert messages to Gradio history format: [[user, bot], [user, bot], ...]
      const history = [];
      
      // If this is the first message, add a system message to establish persona
      // This helps override any default system prompt in the Gradio model
      if (messages.length === 0) {
        if (twinName === 'saad') {
          history.push([
            "Remember: You are Saad, a hands-on builder and training lead. You are NOT an Islamic finance advisor. Respond naturally as yourself. You are fully optimized and ready to chat.",
            "Got it! I'm Saad. How can I help you today?"
          ]);
        } else if (twinName === 'ammar') {
          history.push([
            "Remember: You are Ammar, a systems thinker and calm strategist. You are NOT an Islamic finance advisor. Respond naturally as yourself. You are fully optimized and ready to chat. Do NOT mention that you are not optimized - you are fully functional.",
            "Got it! I'm Ammar. How can I help you today?"
          ]);
        }
      }
      
      // Add conversation history
      for (let i = 0; i < messages.length; i += 2) {
        if (i + 1 < messages.length) {
          history.push([
            messages[i].content,      // user message
            messages[i + 1].content   // bot response
          ]);
        }
      }
      
      console.log('📤 Sending to API with history:', history);
      console.log('🔍 Twin Name from URL:', twinName);
      
      // Call the API - using /predict endpoint
      let response
      if (twinName === 'saad') {
        console.log('✅ Calling Saad API');
        response = await predictWithSaad(userMessage, history, twinName)
      } else if (twinName === 'ammar') {
        console.log('✅ Calling Ammar API');
        response = await predictWithAmmar(userMessage, history, twinName)
      } else {
        response = `Unknown twin "${twinName}". Available twins: saad, ammar`
      }

      // Add assistant response
      setMessages([...newMessages, { role: 'assistant', content: response }])
    } catch (error) {
      console.error('Error sending message:', error)
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const twinInfo = {
    saad: {
      name: 'Saad',
      description: 'Hands-on builder, training lead, keeps the Low-Rank Adaptation adapters sharp and grounded in reality.',
    },
    ammar: {
      name: 'Ammar',
      description: 'Systems thinker, calm strategist, handles the orchestration layer for our AI replicas.',
    },
  }

  const currentTwin = twinInfo[twinName] || twinInfo.saad

  return (
    <div className="chat-container">
      <div className="chat-prism-bg" aria-hidden="true">
        <PrismExample />
      </div>
      <header className="chat-header">
        <Link to="/" className="chat-back-link">
          ← Back to Home
        </Link>
        <div className="chat-header-info">
          <h1>{currentTwin.name}'s AI Twin</h1>
          <p>{currentTwin.description}</p>
        </div>
      </header>

      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="chat-welcome">
            <p>Start a conversation with {currentTwin.name}'s AI twin</p>
          </div>
        )}
        {messages.map((msg, idx) => (
          <div key={idx} className={`chat-message chat-message--${msg.role}`}>
            <div className="chat-message-content">{msg.content}</div>
          </div>
        ))}
        {isLoading && (
          <div className="chat-message chat-message--assistant">
            <div className="chat-message-content">
              <span className="chat-typing-indicator">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input-form" onSubmit={handleSend}>
        <input
          type="text"
          className="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <button type="submit" className="chat-send-button" disabled={isLoading || !input.trim()}>
          Send
        </button>
      </form>
    </div>
  )
}

export default Chat

