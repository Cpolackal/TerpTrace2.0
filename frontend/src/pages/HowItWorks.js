import React from "react";
import { useNavigate } from "react-router-dom";

function HowItWorks() {
  const navigate = useNavigate();

  return (
    <div className="how-it-works">
      <div className="container">
        <h1 className="page-title">How TerpTrace Works</h1>
        <p className="page-subtitle">
          Connecting lost items with their owners at the University of Maryland using AI-powered image matching
        </p>

        <div className="process-section">
          
          <div className="process-step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>Report Your Item</h3>
              <p>
                Whether you've lost something or found something, start by reporting it through our simple form. 
                Provide details like item name, location, description, and upload a photo.
              </p>
            </div>
          </div>

          <div className="process-step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>AI-Powered Matching</h3>
              <p>
                Our advanced AI system analyzes your uploaded image using Amazon Titan's image embedding technology. 
                It creates a unique digital fingerprint of your item and searches through our database for potential matches.
              </p>
            </div>
          </div>

          <div className="process-step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>Instant Results</h3>
              <p>
                Within seconds, you'll see potential matches ranked by similarity. 
                The system compares visual features, not just text descriptions, making it much more accurate than traditional lost and found systems.
              </p>
            </div>
          </div>

          <div className="process-step">
            <div className="step-number">4</div>
            <div className="step-content">
              <h3>Connect & Reunite</h3>
              <p>
                Review the matches and contact the other party using the provided contact information. 
                Our system facilitates the connection while maintaining privacy and security.
              </p>
            </div>
          </div>
        </div>

        <div className="features-section">
          <h2>Key Features</h2>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>Visual Search</h3>
              <p>Uses AI to analyze images and find matches based on visual similarity, not just text descriptions.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Instant Matching</h3>
              <p>Get potential matches within seconds of submitting your report.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🔄</div>
              <h3>Two-Way System</h3>
              <p>Works for both lost and found items, automatically cross-referencing between the two databases.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Easy to Use</h3>
              <p>Simple, intuitive interface that works on any device with a camera.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure & Private</h3>
              <p>Your personal information is protected, and you control who can contact you.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>UMD Focused</h3>
              <p>Specifically designed for the University of Maryland community and campus locations.</p>
            </div>
          </div>
        </div>

        <div className="technology-section">
          <h2>Technology Behind TerpTrace</h2>
          
          <div className="tech-stack">
            <div className="tech-item">
              <h4>Amazon Titan</h4>
              <p>Advanced AI model that creates image embeddings for visual similarity matching</p>
            </div>

            <div className="tech-item">
              <h4>Pinecone Vector Database</h4>
              <p>High-performance vector database that stores and searches image embeddings</p>
            </div>

            <div className="tech-item">
              <h4>AWS S3</h4>
              <p>Secure cloud storage for all uploaded images with automatic backup</p>
            </div>

            <div className="tech-item">
              <h4>React Frontend</h4>
              <p>Modern, responsive web interface built with React for the best user experience</p>
            </div>

            <div className="tech-item">
              <h4>Node.js Backend</h4>
              <p>Fast, scalable server that handles image processing and AI operations</p>
            </div>
          </div>
        </div>

        <div className="cta-section">
          <h2>Ready to Get Started?</h2>
          <p>Join thousands of Terps who have already used TerpTrace to find their lost items!</p>
          <div className="cta-buttons">
            <button 
              className="cta-button primary" 
              onClick={() => navigate("/LostSomething")}
            >
              Report Lost Item
            </button>
            <button 
              className="cta-button secondary" 
              onClick={() => navigate("/FoundSomething")}
            >
              Report Found Item
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HowItWorks;