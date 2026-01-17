// Chat Bot for Career Mantra

class CareerBot {
    constructor() {
        this.chatToggle = document.getElementById('chatToggle');
        this.chatWindow = document.getElementById('chatWindow');
        this.chatBody = document.getElementById('chatBody');
        this.chatInput = document.getElementById('chatInput');
        this.sendMessageBtn = document.getElementById('sendMessage');
        
        this.isOpen = false;
        this.messageHistory = [];
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadGreeting();
    }
    
    setupEventListeners() {
        // Toggle chat window
        if (this.chatToggle) {
            this.chatToggle.addEventListener('click', () => this.toggleChat());
        }
        
        // Send message on button click
        if (this.sendMessageBtn) {
            this.sendMessageBtn.addEventListener('click', () => this.sendUserMessage());
        }
        
        // Send message on Enter key
        if (this.chatInput) {
            this.chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendUserMessage();
                }
            });
        }
        
        // Close chat when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isOpen && 
                !this.chatWindow.contains(e.target) && 
                !this.chatToggle.contains(e.target)) {
                this.closeChat();
            }
        });
    }
    
    toggleChat() {
        this.isOpen ? this.closeChat() : this.openChat();
    }
    
    openChat() {
        if (this.chatWindow) {
            this.chatWindow.classList.add('active');
            this.isOpen = true;
            
            // Focus on input field
            setTimeout(() => {
                if (this.chatInput) {
                    this.chatInput.focus();
                }
            }, 300);
        }
    }
    
    closeChat() {
        if (this.chatWindow) {
            this.chatWindow.classList.remove('active');
            this.isOpen = false;
        }
    }
    
    loadGreeting() {
        // Initial greeting message is already in HTML
        // Add timestamp to message history
        this.addToHistory('bot', 'Hello! I\'m CareerBot, your admission assistant. How can I help you today?');
    }
    
    sendUserMessage() {
        const message = this.chatInput ? this.chatInput.value.trim() : '';
        
        if (!message) return;
        
        // Add user message to chat
        this.addMessage('user', message);
        this.addToHistory('user', message);
        
        // Clear input
        if (this.chatInput) {
            this.chatInput.value = '';
        }
        
        // Simulate typing indicator
        this.showTypingIndicator();
        
        // Get bot response after delay
        setTimeout(() => {
            this.removeTypingIndicator();
            const botResponse = this.getBotResponse(message);
            this.addMessage('bot', botResponse);
            this.addToHistory('bot', botResponse);
        }, 1000 + Math.random() * 1000);
    }
    
    addMessage(sender, text) {
        if (!this.chatBody) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}`;
        messageDiv.textContent = text;
        
        this.chatBody.appendChild(messageDiv);
        
        // Scroll to bottom
        this.scrollToBottom();
    }
    
    addToHistory(sender, text) {
        this.messageHistory.push({
            sender: sender,
            text: text,
            timestamp: new Date().toISOString()
        });
        
        // Keep only last 50 messages
        if (this.messageHistory.length > 50) {
            this.messageHistory.shift();
        }
    }
    
    showTypingIndicator() {
        if (!this.chatBody) return;
        
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chat-message assistant typing-indicator';
        typingDiv.id = 'typingIndicator';
        typingDiv.innerHTML = `
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
        `;
        
        this.chatBody.appendChild(typingDiv);
        this.scrollToBottom();
        
        // Add CSS for typing indicator if not present
        if (!document.querySelector('#typing-styles')) {
            const styles = document.createElement('style');
            styles.id = 'typing-styles';
            styles.textContent = `
                .typing-indicator {
                    background: var(--light-blue) !important;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 60px;
                    height: 40px;
                }
                
                .typing-dot {
                    width: 8px;
                    height: 8px;
                    margin: 0 2px;
                    background: var(--primary-blue);
                    border-radius: 50%;
                    opacity: 0.6;
                    animation: typingBounce 1.4s infinite ease-in-out;
                }
                
                .typing-dot:nth-child(1) {
                    animation-delay: -0.32s;
                }
                
                .typing-dot:nth-child(2) {
                    animation-delay: -0.16s;
                }
                
                @keyframes typingBounce {
                    0%, 80%, 100% {
                        transform: translateY(0);
                    }
                    40% {
                        transform: translateY(-10px);
                    }
                }
            `;
            document.head.appendChild(styles);
        }
    }
    
    removeTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    scrollToBottom() {
        if (this.chatBody) {
            this.chatBody.scrollTop = this.chatBody.scrollHeight;
        }
    }
    
    getBotResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        // Common queries and responses
        const responses = {
            greetings: [
                "Hello! How can I assist you with your educational journey today?",
                "Hi there! I'm here to help you find the perfect college or course.",
                "Welcome! I'm CareerBot, your personal admission assistant."
            ],
            
            admission: [
                "The admission process varies by college and course. I can help you find specific admission requirements for your chosen program.",
                "Most admissions require entrance exams, academic transcripts, and personal interviews. Would you like details for a specific college?",
                "We offer admission guidance for 500+ colleges. Tell me which course you're interested in!"
            ],
            
            courses: [
                "We offer courses in Engineering, Management, Medicine, Law, Design, and many more fields. Which field interests you?",
                "From B.Tech to MBA, MBBS to LLB - we have a wide range of courses. What are you looking to study?",
                "Our partner colleges offer UG, PG, and Doctoral programs across diverse streams."
            ],
            
            placement: [
                "Our average placement rate is 94% with top companies like TCS, Infosys, Amazon, and Microsoft recruiting from our partner colleges.",
                "The highest package offered this year was 2.5 CR, with an average CTC of 16.3 LPA for top 100 students.",
                "We have 1000+ recruiting partners across various industries."
            ],
            
            scholarship: [
                "Yes! We offer scholarships based on merit, entrance exam scores, and financial need. Some scholarships cover up to 100% of tuition fees.",
                "You can apply for our scholarship test to get up to 100% tuition fee waiver. Would you like me to guide you through the registration process?",
                "Scholarships are available for all major courses. Tell me which course you're interested in, and I'll provide specific scholarship information."
            ],
            
            contact: [
                "You can reach us at 1800-123-4567 or email info@careermantra.net. Our team is available Monday to Friday, 9AM to 6PM.",
                "For admission queries, call our helpline at 1800-123-4567. You can also visit our office in Mumbai.",
                "Contact us via phone, email, or visit our website for more information."
            ],
            
            default: [
                "I can help you with college admissions, course details, placement statistics, and scholarship information. What specifically would you like to know?",
                "That's an interesting question! I'm trained to help with educational queries. Could you please rephrase or ask about admissions, courses, or placements?",
                "I'm here to assist with your educational journey. You can ask me about colleges, courses, admissions, placements, or scholarships."
            ]
        };
        
        // Determine response category based on user message
        let category = 'default';
        
        if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
            category = 'greetings';
        } else if (message.includes('admission') || message.includes('apply') || message.includes('enroll')) {
            category = 'admission';
        } else if (message.includes('course') || message.includes('program') || message.includes('study')) {
            category = 'courses';
        } else if (message.includes('placement') || message.includes('job') || message.includes('career')) {
            category = 'placement';
        } else if (message.includes('scholarship') || message.includes('fee') || message.includes('financial')) {
            category = 'scholarship';
        } else if (message.includes('contact') || message.includes('call') || message.includes('email')) {
            category = 'contact';
        }
        
        // Get random response from the category
        const categoryResponses = responses[category];
        const randomIndex = Math.floor(Math.random() * categoryResponses.length);
        
        return categoryResponses[randomIndex];
    }
    
    // Quick replies feature
    addQuickReplies() {
        if (!this.chatBody) return;
        
        const quickReplies = document.createElement('div');
        quickReplies.className = 'quick-replies';
        quickReplies.innerHTML = `
            <p>Quick options:</p>
            <button class="quick-reply" data-query="admission process">Admission Process</button>
            <button class="quick-reply" data-query="engineering courses">Engineering Courses</button>
            <button class="quick-reply" data-query="placement statistics">Placement Stats</button>
            <button class="quick-reply" data-query="scholarship information">Scholarships</button>
        `;
        
        this.chatBody.appendChild(quickReplies);
        
        // Add event listeners to quick reply buttons
        document.querySelectorAll('.quick-reply').forEach(button => {
            button.addEventListener('click', (e) => {
                const query = e.target.dataset.query;
                if (this.chatInput) {
                    this.chatInput.value = query;
                    this.sendUserMessage();
                }
            });
        });
        
        this.scrollToBottom();
    }
    
    // Save chat history
    saveChatHistory() {
        try {
            localStorage.setItem('careerBotHistory', JSON.stringify(this.messageHistory));
        } catch (e) {
            console.log('Could not save chat history:', e);
        }
    }
    
    // Load chat history
    loadChatHistory() {
        try {
            const savedHistory = localStorage.getItem('careerBotHistory');
            if (savedHistory) {
                this.messageHistory = JSON.parse(savedHistory);
                
                // Display last 10 messages
                const lastMessages = this.messageHistory.slice(-10);
                lastMessages.forEach(msg => {
                    this.addMessage(msg.sender, msg.text);
                });
            }
        } catch (e) {
            console.log('Could not load chat history:', e);
        }
    }
}

// Initialize chat bot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const careerBot = new CareerBot();
    
    // Add quick replies after first bot response
    setTimeout(() => {
        careerBot.addQuickReplies();
    }, 2000);
    
    // Save chat history periodically
    setInterval(() => {
        careerBot.saveChatHistory();
    }, 30000);
    
    // Load chat history if exists
    careerBot.loadChatHistory();
});

// Export for module usage if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CareerBot;
}