import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import PrismExample from './PrismExample'
import Chat from './src/components/Chat'
import './App.css'

const twins = [
  {
    name: 'Ammar',
    description: 'Systems thinker, calm strategist, handles the orchestration layer for our AI replicas.',
    href: '/chat/ammar',
  },
  {
    name: 'Saad',
    description: 'Hands-on builder, training lead, keeps the Low-Rank Adaptation adapters sharp and grounded in reality.',
    href: '/chat/saad',
  },
]

function Home() {
  return (
    <div className="App">
      <div className="prism-bg" aria-hidden="true">
        <PrismExample />
      </div>

      <main className="hero">
        <p className="hero__eyebrow">AI twin initiative</p>
        <h1 className="hero__title">Mirror your conversations with Ammar &amp; Saad</h1>
        <p className="hero__subtitle">
          A living experiment in personality replication. Two neural mirrors fine-tuned with Low-Rank Adaptation + Phi-3, ready to talk like
          their human counterparts.
        </p>

        <div className="twin-grid">
          {twins.map(twin => (
            <Link key={twin.name} className="twin-card" to={twin.href}>
              <div className="twin-card__accent" aria-hidden="true" />
              <div className="twin-card__body">
                <p className="twin-card__label">AI twin</p>
                <h2>{twin.name}</h2>
                <p className="twin-card__description">{twin.description}</p>
              </div>
              <span className="twin-card__cta">Launch chat →</span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat/:twinName" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
