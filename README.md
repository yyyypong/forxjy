# Personalized Vocabulary Learning Platform
 
一个量身定做的简易的背单词网站，是送给我女朋友徐江雨的生日礼物，这是我们一起过的第一个生日，我很爱她。

## Architecture

### Frontend
- HTML5, CSS3, and JavaScript for the user interface
- Responsive design for cross-device compatibility
- Custom CSS for a visually appealing, themed interface

### Backend
- Node.js with Express.js framework
- RESTful API architecture for client-server communication

### Database
- In-memory data storage (can be extended to persistent database)

### Key Features
1. **User Authentication**: Secure login and registration system
2. **Personalized Word Bank**: Users can add, delete, and manage their vocabulary
3. **Interactive Quizzes**: Randomly generated quizzes from the user's word bank
4. **Progress Tracking**: Tracks quiz scores and learning progress
5. **Leaderboard**: Gamification element to encourage competition
6. **Message Board**: Social feature for users to share thoughts and motivate each other
7. **User Profiles**: Customizable profiles with avatars and personal statistics

### File Structure
- `/public`: Static files (HTML, CSS, client-side JS)
  - `/css`: Stylesheets
  - `/js`: Client-side JavaScript
  - `index.html`: Login page
  - `home.html`: Main application page
- `server.js`: Main server file with Express.js setup and API routes
- `package.json`: Project dependencies and scripts

## Security Features
- CORS (Cross-Origin Resource Sharing) configuration
- Helmet.js for enhanced API security
- Password hashing (to be implemented)

## Scalability
The current architecture uses in-memory storage, which is suitable for prototyping and small-scale use. For production and larger scale deployment, it can be easily extended to use a persistent database like MongoDB or PostgreSQL.

## Future Enhancements
- Implement a persistent database
- Add more advanced quiz types
- Integrate with external dictionary APIs
- Implement spaced repetition algorithm for optimized learning
- Mobile app version

## Contributing
Contributions to enhance and expand this project are welcome. Please feel free to fork the repository, make changes, and submit pull requests.

## License
[@yyyypong](https://github.com/yyyypong)

