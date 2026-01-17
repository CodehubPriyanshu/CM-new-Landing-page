// blogs.js - Blogs section functionality
class Blogs {
    constructor() {
        this.blogCards = document.querySelectorAll('.blog-card');
        this.blogAssistantBtn = document.querySelector('.assistant-btn');
        this.init();
    }

    init() {
        this.setupBlogInteractions();
        this.setupAssistantChat();
    }

    setupBlogInteractions() {
        this.blogCards.forEach(blog => {
            blog.addEventListener('click', (e) => {
                // Don't trigger if clicking on read more link
                if (!e.target.closest('.blog-read-more')) {
                    const blogTitle = blog.querySelector('.blog-title').textContent;
                    Utils.showNotification(`Loading blog: ${blogTitle}`, 'info');
                    // In real app: navigate to blog page
                }
            });

            // Add hover effect
            blog.addEventListener('mouseenter', () => {
                const img = blog.querySelector('.blog-image img');
                if (img) {
                    img.style.transform = 'scale(1.05)';
                }
            });

            blog.addEventListener('mouseleave', () => {
                const img = blog.querySelector('.blog-image img');
                if (img && !blog.classList.contains('clicked')) {
                    img.style.transform = 'scale(1)';
                }
            });
        });
    }

    setupAssistantChat() {
        if (this.blogAssistantBtn) {
            this.blogAssistantBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showAssistantModal();
            });
        }
    }

    showAssistantModal() {
        const modalId = Utils.generateId('assistant-modal');
        
        const modalHTML = `
            <div id="${modalId}" class="modal">
                <div class="modal-overlay"></div>
                <div class="modal-content">
                    <div class="modal-header">
                        <div class="assistant-modal-header">
                            <div class="assistant-avatar">
                                <i class="fas fa-robot"></i>
                            </div>
                            <div>
                                <h3>Niaa - Your Admission Assistant</h3>
                                <p class="assistant-status"><span class="status-dot"></span> Online</p>
                            </div>
                        </div>
                        <span class="close-modal">&times;</span>
                    </div>
                    <div class="modal-body">
                        <div class="chat-container">
                            <div class="chat-messages">
                                <div class="message assistant-message">
                                    <div class="message-content">
                                        <p>Hi there! 👋 I'm Niaa, your personal admission assistant. How can I help you with college blogs today?</p>
                                    </div>
                                    <div class="message-time">Just now</div>
                                </div>
                            </div>
                            
                            <div class="quick-questions">
                                <p class="quick-questions-title">Quick questions you can ask:</p>
                                <div class="quick-questions-grid">
                                    <button class="quick-question-btn">Which blog is most relevant for me?</button>
                                    <button class="quick-question-btn">How do I apply after reading blogs?</button>
                                    <button class="quick-question-btn">More blogs on engineering?</button>
                                    <button class="quick-question-btn">Connect with blog authors</button>
                                </div>
                            </div>
                            
                            <div class="chat-input-container">
                                <input type="text" placeholder="Type your message here..." class="chat-input">
                                <button class="btn btn-primary send-btn">
                                    <i class="fas fa-paper-plane"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        const modal = document.getElementById(modalId);
        
        // Add chat styles
        this.addChatStyles();
        
        // Show modal
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
        
        // Setup modal events
        this.setupChatModalEvents(modal);
    }

    addChatStyles() {
        if (document.getElementById('chat-styles')) return;
        
        const styles = `
            .assistant-modal-header {
                display: flex;
                align-items: center;
                gap: 15px;
            }
            .assistant-avatar {
                width: 50px;
                height: 50px;
                background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 24px;
            }
            .assistant-status {
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 14px;
                color: var(--text-light);
                margin-top: 5px;
            }
            .status-dot {
                display: inline-block;
                width: 8px;
                height: 8px;
                background: #4CAF50;
                border-radius: 50%;
                animation: pulse 2s infinite;
            }
            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }
            .chat-container {
                height: 400px;
                display: flex;
                flex-direction: column;
            }
            .chat-messages {
                flex: 1;
                overflow-y: auto;
                padding: 20px 0;
            }
            .message {
                margin-bottom: 20px;
                max-width: 80%;
            }
            .assistant-message {
                margin-right: auto;
            }
            .user-message {
                margin-left: auto;
            }
            .message-content {
                padding: 12px 16px;
                border-radius: 18px;
                background: #f0f4ff;
                margin-bottom: 5px;
            }
            .user-message .message-content {
                background: var(--primary-color);
                color: white;
            }
            .message-time {
                font-size: 12px;
                color: var(--text-light);
                padding: 0 10px;
            }
            .quick-questions {
                margin: 20px 0;
                padding: 20px;
                background: #f9f9f9;
                border-radius: 10px;
            }
            .quick-questions-title {
                font-size: 14px;
                color: var(--text-light);
                margin-bottom: 10px;
            }
            .quick-questions-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 10px;
            }
            .quick-question-btn {
                padding: 10px;
                background: white;
                border: 1px solid var(--border-color);
                border-radius: 8px;
                cursor: pointer;
                font-size: 13px;
                text-align: left;
                transition: var(--transition);
            }
            .quick-question-btn:hover {
                background: var(--primary-color);
                color: white;
                border-color: var(--primary-color);
            }
            .chat-input-container {
                display: flex;
                gap: 10px;
                padding-top: 20px;
                border-top: 1px solid var(--border-color);
            }
            .chat-input {
                flex: 1;
                padding: 12px 16px;
                border: 1px solid var(--border-color);
                border-radius: 25px;
                font-size: 14px;
            }
            .chat-input:focus {
                outline: none;
                border-color: var(--primary-color);
            }
            .send-btn {
                width: 45px;
                height: 45px;
                border-radius: 50%;
                padding: 0;
            }
        `;
        
        const styleElement = document.createElement('style');
        styleElement.id = 'chat-styles';
        styleElement.textContent = styles;
        document.head.appendChild(styleElement);
    }

    setupChatModalEvents(modal) {
        // Close modal
        const closeBtn = modal.querySelector('.close-modal');
        const overlay = modal.querySelector('.modal-overlay');
        
        const closeModal = () => {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.remove();
            }, 300);
        };
        
        closeBtn.addEventListener('click', closeModal);
        overlay.addEventListener('click', closeModal);
        
        // Quick question buttons
        modal.querySelectorAll('.quick-question-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const question = btn.textContent;
                this.sendMessage(question, modal);
            });
        });
        
        // Chat input
        const chatInput = modal.querySelector('.chat-input');
        const sendBtn = modal.querySelector('.send-btn');
        
        const sendMessage = () => {
            const message = chatInput.value.trim();
            if (message) {
                this.sendMessage(message, modal);
                chatInput.value = '';
            }
        };
        
        sendBtn.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

    sendMessage(message, modal) {
        const chatMessages = modal.querySelector('.chat-messages');
        
        // Add user message
        const userMessage = document.createElement('div');
        userMessage.className = 'message user-message';
        userMessage.innerHTML = `
            <div class="message-content">
                <p>${message}</p>
            </div>
            <div class="message-time">Just now</div>
        `;
        chatMessages.appendChild(userMessage);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Simulate assistant response
        setTimeout(() => {
            const responses = [
                "That's a great question! Based on your profile, I recommend reading the blog about Information Systems Security.",
                "After reading blogs, you can apply directly through our platform. Would you like me to guide you through the application process?",
                "We have several engineering blogs. Would you like me to filter blogs specifically for engineering students?",
                "I can connect you with our admission counselors who can answer specific questions about the blogs. Would you like me to schedule a call?"
            ];
            
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            
            const assistantMessage = document.createElement('div');
            assistantMessage.className = 'message assistant-message';
            assistantMessage.innerHTML = `
                <div class="message-content">
                    <p>${randomResponse}</p>
                </div>
                <div class="message-time">Just now</div>
            `;
            chatMessages.appendChild(assistantMessage);
            
            // Scroll to bottom
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1000);
    }
}

// Initialize blogs
document.addEventListener('DOMContentLoaded', () => {
    window.blogs = new Blogs();
});