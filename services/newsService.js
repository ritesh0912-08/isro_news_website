const axios = require('axios');
const cheerio = require('cheerio');
const cron = require('node-cron');
const News = require('../models/News.js');

// News API configuration
const NEWS_API_KEY = '499923e5e13840939ab8e0be38617f6f';
const NEWS_API_URL = 'https://newsapi.org/v2/everything';

// ISRO-specific keywords for better news filtering
const ISRO_KEYWORDS = {
    missions: [
        'chandrayaan',
        'gaganyaan',
        'mangalyaan',
        'aditya-l1',
        'nasa-isro',
        'pslv',
        'gslv',
        'sslv',
        'cartosat',
        'risat',
        'gsat',
        'insat'
    ],
    spaceTerms: [
        'space mission',
        'space launch',
        'satellite launch',
        'rocket launch',
        'spacecraft',
        'space program',
        'space research',
        'space technology',
        'space science',
        'space exploration',
        'orbital',
        'space station',
        'space agency'
    ],
    locations: [
        'sriharikota',
        'satish dhawan',
        'vikram sarabhai',
        'isro headquarters',
        'ur rao',
        'mahendragiri'
    ],
    people: [
        's somnath',
        'k sivan',
        'ur rao',
        'vikram sarabhai',
        'satish dhawan'
    ]
};

// Function to check if news is current (within last 12 hours)
function isNewsCurrent(publishedAt) {
    const newsDate = new Date(publishedAt);
    const now = new Date();
    const hoursDiff = (now - newsDate) / (1000 * 60 * 60);
    return hoursDiff <= 12; // Return true if news is less than 12 hours old
}

// Function to get today's date range
function getTodayDateRange() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return {
        from: today.toISOString(),
        to: tomorrow.toISOString()
    };
}

// Function to fetch today's news
async function fetchTodaysNews() {
    try {
        console.log('Fetching today\'s ISRO news...');
        const dateRange = getTodayDateRange();
        
        // Build a comprehensive search query
        const searchQuery = [
            '(ISRO OR "Indian Space Research Organisation")',
            ...ISRO_KEYWORDS.missions,
            ...ISRO_KEYWORDS.locations,
            ...ISRO_KEYWORDS.programs,
            ...ISRO_KEYWORDS.people
        ].join(' OR ');

        const response = await axios.get(NEWS_API_URL, {
            params: {
                q: searchQuery,
                language: 'en',
                sortBy: 'publishedAt',
                pageSize: 100, // Increased to get more today's news
                apiKey: '499923e5e13840939ab8e0be38617f6f',
                from: dateRange.from,
                to: dateRange.to
            },
            headers: {
                'X-Api-Key': NEWS_API_KEY
            }
        });

        if (response.data.status === 'ok' && response.data.articles.length > 0) {
            console.log(`Found ${response.data.articles.length} potential news articles for today`);
            
            // Filter articles to ensure they are ISRO-related
            const isroNews = response.data.articles.filter(article => {
                const title = article.title.toLowerCase();
                const content = (article.description || article.content || '').toLowerCase();
                
                // Check for ISRO or Indian Space Research Organisation
                const hasIsro = title.includes('isro') || 
                              title.includes('indian space research') ||
                              content.includes('isro') || 
                              content.includes('indian space research');
                
                // Check for any ISRO-specific keywords
                const hasIsroKeywords = [
                    ...ISRO_KEYWORDS.missions,
                    ...ISRO_KEYWORDS.locations,
                    ...ISRO_KEYWORDS.programs,
                    ...ISRO_KEYWORDS.people
                ].some(keyword => title.includes(keyword) || content.includes(keyword));
                
                // Check for breaking news keywords
                const isBreaking = title.includes('breaking') || 
                                 title.includes('latest') ||
                                 title.includes('just in') ||
                                 title.includes('update') ||
                                 content.includes('breaking') ||
                                 content.includes('latest') ||
                                 content.includes('just in') ||
                                 content.includes('update');

                return (hasIsro || hasIsroKeywords);
            });

            console.log(`Filtered to ${isroNews.length} ISRO-related articles for today`);
            
            return isroNews.map(article => ({
                title: article.title,
                content: article.description || article.content,
                imageUrl: article.urlToImage,
                source: article.source.name,
                publishedAt: new Date(article.publishedAt),
                url: article.url,
                isLive: true,
                isBreaking: article.title.toLowerCase().includes('breaking') || 
                           article.title.toLowerCase().includes('latest') ||
                           article.title.toLowerCase().includes('just in') ||
                           article.title.toLowerCase().includes('update')
            }));
        }
        return [];
    } catch (error) {
        console.error('Error fetching today\'s news:', error.message);
        if (error.response) {
            console.error('API Response:', error.response.data);
        }
        return [];
    }
}

// Function to fetch image from Google based on news title
async function fetchImageFromGoogle(query) {
    try {
        // Map of mission types to relevant ISRO images
        const missionImages = {
            'PSLV': [
                'https://www.isro.gov.in/sites/default/files/article_images/pslv-c55.jpg',
                'https://www.isro.gov.in/sites/default/files/article_images/pslv-c54.jpg',
                'https://www.isro.gov.in/sites/default/files/article_images/pslv-c53.jpg'
            ],
            'GSLV': [
                'https://www.isro.gov.in/sites/default/files/article_images/gslv-f10.jpg',
                'https://www.isro.gov.in/sites/default/files/article_images/gslv-mk3.jpg'
            ],
            'EOS': [
                'https://www.isro.gov.in/sites/default/files/article_images/eos-06.jpg',
                'https://www.isro.gov.in/sites/default/files/article_images/eos-04.jpg'
            ],
            'SPADEX': [
                'https://www.isro.gov.in/sites/default/files/article_images/spadex.jpg'
            ],
            'PROBA': [
                'https://www.isro.gov.in/sites/default/files/article_images/proba-3.jpg'
            ]
        };

        // Default ISRO images
        const defaultImages = [
            'https://www.isro.gov.in/sites/default/files/article_images/isro-logo.png',
            'https://www.isro.gov.in/sites/default/files/article_images/satellite.jpg',
            'https://www.isro.gov.in/sites/default/files/article_images/rocket.jpg',
            'https://www.isro.gov.in/sites/default/files/article_images/spacecraft.jpg',
            'https://www.isro.gov.in/sites/default/files/article_images/launch.jpg'
        ];

        // Check if the query contains any mission keywords
        for (const [mission, images] of Object.entries(missionImages)) {
            if (query.toLowerCase().includes(mission.toLowerCase())) {
                return images[Math.floor(Math.random() * images.length)];
            }
        }

        // If no mission match found, return a random default image
        return defaultImages[Math.floor(Math.random() * defaultImages.length)];
    } catch (error) {
        console.error('Error fetching image:', error);
        return 'https://www.isro.gov.in/sites/default/files/article_images/isro-logo.png';
    }
}

// Function to determine news category
function determineCategory(title, content) {
    const lowerTitle = title.toLowerCase();
    const lowerContent = content.toLowerCase();

    if (lowerTitle.includes('launch') || lowerContent.includes('launch')) {
        return 'Launch';
    } else if (lowerTitle.includes('research') || lowerContent.includes('research')) {
        return 'Research';
    } else if (lowerTitle.includes('achievement') || lowerContent.includes('achievement')) {
        return 'Achievement';
    } else if (lowerTitle.includes('collaboration') || lowerContent.includes('collaboration')) {
        return 'Collaboration';
    }
    return 'Other';
}

// Function to save news items
async function saveNewsItems(newsItems) {
    try {
        const savedItems = [];
        for (const item of newsItems) {
            // Check if news with same title already exists
            const existingNews = await News.findOne({ title: item.title });
            if (existingNews) {
                continue;
            }

            // Create new news item with current timestamp
            const news = new News({
                title: item.title,
                content: item.content,
                imageUrl: item.imageUrl || await fetchImageFromGoogle(item.title),
                category: determineCategory(item.title, item.content),
                source: item.source || 'News API',
                url: item.url,
                isBreaking: item.isBreaking,
                isLive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
                displayOrder: Date.now() // This will be sorted in descending order
            });

            await news.save();
            savedItems.push(news);
            console.log(`New ISRO news found: "${news.title}"`);
        }

        // Update status of old news items
        if (savedItems.length > 0) {
            const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
            await News.updateMany(
                { 
                    _id: { $nin: savedItems.map(item => item._id) },
                    createdAt: { $lt: oneDayAgo }
                },
                { $set: { isLive: false } }
            );
        }

        return savedItems;
    } catch (error) {
        console.error('Error saving news items:', error);
        return [];
    }
}

// Function to get all news sorted by displayOrder
async function getAllNews() {
    try {
        return await News.find({ isLive: true })
            .sort({ displayOrder: -1, createdAt: -1 }) // Changed to descending order
            .limit(50);
    } catch (error) {
        console.error('Error getting news:', error);
        return [];
    }
}

// Function to fetch news with retries
async function fetchNewsWithRetry(maxRetries = 3, delay = 1000) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const newsItems = await fetchTodaysNews();
            if (newsItems && newsItems.length > 0) {
                return newsItems;
            }
            console.log(`Attempt ${attempt}: No news found, retrying...`);
        } catch (error) {
            console.error(`Attempt ${attempt} failed:`, error.message);
            if (attempt === maxRetries) {
                throw error;
            }
        }
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay));
    }
    return [];
}

// Function to check if news is space/ISRO related
function isSpaceRelatedNews(title, content) {
    const lowerTitle = title.toLowerCase();
    const lowerContent = content.toLowerCase();

    // Must contain ISRO or Indian Space Research Organisation
    const hasIsro = lowerTitle.includes('isro') || 
                   lowerTitle.includes('indian space research') ||
                   lowerContent.includes('isro') || 
                   lowerContent.includes('indian space research');

    // Check for space-related terms
    const hasSpaceTerms = ISRO_KEYWORDS.spaceTerms.some(term => 
        lowerTitle.includes(term) || lowerContent.includes(term)
    );

    // Check for mission keywords
    const hasMission = ISRO_KEYWORDS.missions.some(mission => 
        lowerTitle.includes(mission) || lowerContent.includes(mission)
    );

    // Check for location keywords
    const hasLocation = ISRO_KEYWORDS.locations.some(loc => 
        lowerTitle.includes(loc) || lowerContent.includes(loc)
    );

    // Check for people keywords
    const hasPeople = ISRO_KEYWORDS.people.some(person => 
        lowerTitle.includes(person) || lowerContent.includes(person)
    );

    // Exclude non-space related news
    const isNonSpaceNews = lowerTitle.includes('university') || 
                          lowerTitle.includes('education') ||
                          lowerTitle.includes('college') ||
                          lowerTitle.includes('school') ||
                          lowerTitle.includes('appointment') ||
                          lowerTitle.includes('chancellor') ||
                          lowerTitle.includes('meeting') ||
                          lowerTitle.includes('conference') ||
                          lowerTitle.includes('seminar') ||
                          lowerTitle.includes('workshop');

    // News must be related to ISRO AND space activities
    return hasIsro && (hasSpaceTerms || hasMission || hasLocation || hasPeople) && !isNonSpaceNews;
}

// Function to fetch latest ISRO news
async function fetchLatestISRONews() {
    try {
        // Simplified search query to get more results
        const searchQuery = 'ISRO OR "Indian Space Research"';

        const response = await axios.get(NEWS_API_URL, {
            params: {
                q: searchQuery,
                language: 'en',
                sortBy: 'publishedAt',
                pageSize: 50,
                apiKey: NEWS_API_KEY
            },
            headers: {
                'X-Api-Key': NEWS_API_KEY
            }
        });

        if (response.data.status === 'ok' && response.data.articles.length > 0) {
            // Get the most recent news
            const latestNews = response.data.articles[0];
            
            // Check if news already exists in database
            const existingNews = await News.findOne({ title: latestNews.title });
            if (!existingNews) {
                return [{
                    title: latestNews.title,
                    content: latestNews.description || latestNews.content,
                    imageUrl: latestNews.urlToImage,
                    source: latestNews.source.name,
                    publishedAt: new Date(latestNews.publishedAt),
                    url: latestNews.url,
                    isLive: true,
                    isBreaking: latestNews.title.toLowerCase().includes('breaking') || 
                               latestNews.title.toLowerCase().includes('latest') ||
                               latestNews.title.toLowerCase().includes('just in') ||
                               latestNews.title.toLowerCase().includes('update')
                }];
            }
        }
        return [];
    } catch (error) {
        console.error('Error fetching latest ISRO space news:', error.message);
        if (error.response) {
            console.error('API Response:', error.response.data);
        }
        return [];
    }
}

// Initialize the news update scheduler
function initializeNewsScheduler() {
    // Schedule news updates at specific times
    const scheduleTimes = [
        '0 12 * * *',  // 5:41 PM
        
    ];

    scheduleTimes.forEach(time => {
        cron.schedule(time, async () => {
            console.log(`Running scheduled news fetch at ${time}`);
            let retryCount = 0;
            const maxRetries = 3;

            while (retryCount < maxRetries) {
                try {
                    // Try to fetch latest news
                    const newsItems = await fetchLatestISRONews();
                    
                    if (!newsItems || newsItems.length === 0) {
                        console.log('No new news found, retrying...');
                        retryCount++;
                        await new Promise(resolve => setTimeout(resolve, 2000));
                        continue;
                    }

                    // Save the news item
                    const savedItems = await saveNewsItems(newsItems);
                    if (savedItems.length > 0) {
                        console.log(`New ISRO news found and saved at ${new Date().toLocaleTimeString()}: "${savedItems[0].title}"`);
                        break;
                    } else {
                        console.log('No new news to save, retrying...');
                        retryCount++;
                        await new Promise(resolve => setTimeout(resolve, 2000));
                        continue;
                    }
                } catch (error) {
                    console.error(`Error in news update (attempt ${retryCount + 1}):`, error);
                    retryCount++;
                    
                    if (retryCount < maxRetries) {
                        await new Promise(resolve => setTimeout(resolve, 2000));
                    } else {
                        console.error('Failed to fetch latest news after 3 attempts');
                    }
                }
            }
        }, {
            scheduled: true,
            timezone: "Asia/Kolkata" // Set timezone to IST
        });
    });

    console.log('News scheduler initialized to fetch one latest ISRO news at 12:00 PM daily (IST)');
}

// Function to show notification
function showNotification(message, type = 'success') {
    console.log(`[${type.toUpperCase()}] ${message}`);
    // You can add additional notification methods here (email, SMS, etc.)
}

// Export functions
module.exports = {
    fetchTodaysNews,
    saveNewsItems,
    initializeNewsScheduler,
    getAllNews
}; 