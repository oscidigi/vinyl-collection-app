/**
 * Collection Statistics Feature
 * Integrates stats.js and stats-ui.js to create a comprehensive collection statistics visualization
 */

// Store the original data loading function reference to hook into it
let originalFetchVinylData;

// Global store for vinyl data
window.vinylData = {
    albums: [],
    isLoaded: false
};

/**
 * Initialize the collection stats feature
 * This hooks into the existing app to capture data and add the stats feature
 */
function initCollectionStats() {
    console.log('Initializing Collection Stats feature...');
    
    // Load the required CSS
    loadStatsStyles();
    
    // Hook into the data loading process
    hookIntoDataLoading();
    
    // Initialize the stats UI (button and modal) if not already done
    // We'll use a flag to track if initialization has happened
    if (!window.statsInitialized) {
        if (window.VinylStatsUI && typeof window.VinylStatsUI.initStatsUI === 'function') {
            window.VinylStatsUI.initStatsUI();
            window.statsInitialized = true;
            console.log('Stats UI initialized from integration module');
        } else if (typeof window.initStatsUI === 'function') {
            window.initStatsUI();
            window.statsInitialized = true;
            console.log('Stats UI initialized from global function');
        } else {
            // If the UI module isn't loaded yet, wait and try again
            console.log('Stats UI not ready, will try again in 500ms');
            setTimeout(function() {
                if (window.VinylStatsUI && typeof window.VinylStatsUI.initStatsUI === 'function') {
                    window.VinylStatsUI.initStatsUI();
                    window.statsInitialized = true;
                    console.log('Stats UI initialized after delay');
                } else if (typeof window.initStatsUI === 'function') {
                    window.initStatsUI();
                    window.statsInitialized = true;
                    console.log('Stats UI initialized after delay via global function');
                } else {
                    console.error('Failed to initialize Stats UI after delay');
                }
            }, 500);
        }
    }
    
    console.log('Collection Stats feature initialized');
}

/**
 * Load the stats CSS styles
 */
function loadStatsStyles() {
    // Check if the styles are already loaded
    if (!document.querySelector('link[href="css/stats.css"]')) {
        const head = document.head || document.getElementsByTagName('head')[0];
        const style = document.createElement('link');
        style.rel = 'stylesheet';
        style.type = 'text/css';
        style.href = 'css/stats.css';
        head.appendChild(style);
        console.log('Stats CSS loaded');
    }
}

// The rest of the file remains unchanged
// Original hookIntoDataLoading function and other utility functions...

/**
 * Hook into the app's data loading function to capture album data
 */
function hookIntoDataLoading() {
    // Check if fetchVinylData exists in the global scope
    if (typeof window.fetchVinylData === 'function') {
        // Store the original function
        originalFetchVinylData = window.fetchVinylData;
        
        // Replace with our enhanced version
        window.fetchVinylData = function() {
            const result = originalFetchVinylData.apply(this, arguments);
            
            // If the result is a Promise, hook into it
            if (result && typeof result.then === 'function') {
                result.then(data => {
                    // Store the albums data for stats use
                    if (data && Array.isArray(data)) {
                        window.vinylData.albums = data;
                        window.vinylData.isLoaded = true;
                        console.log('Vinyl data captured for stats:', data.length, 'albums');
                    }
                }).catch(error => {
                    console.error('Error capturing vinyl data for stats:', error);
                });
            }
            
            return result;
        };
        
        console.log('Successfully hooked into data loading function');
    } else {
        // If the function doesn't exist yet, check for albumsData directly
        const checkForAlbumsData = setInterval(() => {
            // Look for albums data in the DOM
            const albumCards = document.querySelectorAll('.album-card');
            if (albumCards.length > 0) {
                // Extract data from the DOM
                const extractedData = Array.from(albumCards).map(card => {
                    const artist = card.querySelector('.album-artist')?.textContent || '';
                    const title = card.querySelector('.album-title')?.textContent || '';
                    const genre = card.querySelector('.album-genre')?.textContent || '';
                    const year = card.querySelector('.album-year')?.textContent || '';
                    const isFavorite = card.classList.contains('favorite');
                    const isEP = card.querySelector('.album-ep-tag') !== null;
                    
                    return {
                        artist,
                        title,
                        genre,
                        year,
                        isfavorite: isFavorite ? 'yes' : 'no',
                        isep: isEP ? 'yes' : 'no'
                    };
                });
                
                if (extractedData.length > 0) {
                    window.vinylData.albums = extractedData;
                    window.vinylData.isLoaded = true;
                    console.log('Vinyl data extracted from DOM:', extractedData.length, 'albums');
                    clearInterval(checkForAlbumsData);
                }
            }
            // Also check for global variables that might contain the data
            else if (window.albumsData && Array.isArray(window.albumsData) && window.albumsData.length > 0) {
                window.vinylData.albums = window.albumsData;
                window.vinylData.isLoaded = true;
                console.log('Vinyl data found in global albumsData:', window.albumsData.length, 'albums');
                clearInterval(checkForAlbumsData);
            }
        }, 1000);
        
        // Stop checking after 10 seconds to prevent infinite checking
        setTimeout(() => {
            clearInterval(checkForAlbumsData);
            console.log('Stopped looking for album data after timeout');
        }, 10000);
    }
}

/**
 * Check if all required modules are loaded
 * @returns {boolean} True if all modules are loaded
 */
function areAllModulesLoaded() {
    return (
        typeof window.VinylStats !== 'undefined' &&
        typeof window.VinylStats.calculateCollectionStats === 'function' &&
        typeof window.VinylStatsUI !== 'undefined' &&
        typeof window.VinylStatsUI.showStatsModal === 'function'
    );
}

/**
 * Load a JavaScript module dynamically
 * @param {string} url - The URL of the JavaScript file
 * @returns {Promise} A promise that resolves when the script is loaded
 */
function loadScript(url) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = url;
        script.async = true;
        
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load script: ${url}`));
        
        document.head.appendChild(script);
    });
}

/**
 * Load all required modules for the stats feature
 * @returns {Promise} A promise that resolves when all modules are loaded
 */
async function loadModules() {
    try {
        // Load the core stats module
        await loadScript('js/stats.js');
        console.log('Stats core module loaded');
        
        // Load the UI module
        await loadScript('js/stats-ui.js');
        console.log('Stats UI module loaded');
        
        // Dispatch an event to signal that modules are loaded
        const event = new CustomEvent('statsModulesLoaded');
        document.dispatchEvent(event);
        
        return true;
    } catch (error) {
        console.error('Error loading stats modules:', error);
        return false;
    }
}

// Initialize when the DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Stats integration: DOMContentLoaded fired');
    
    // Load required modules if needed
    if (!areAllModulesLoaded()) {
        await loadModules();
    }
    
    // Initialize the feature with a slight delay to allow other scripts to load
    setTimeout(() => {
        initCollectionStats();
    }, 300);
});

// Export some utilities for debugging
window.CollectionStats = {
    getData: () => window.vinylData,
    showStats: () => {
        if (window.VinylStatsUI && typeof window.VinylStatsUI.showStatsModal === 'function') {
            window.VinylStatsUI.showStatsModal();
        } else {
            console.error('Stats UI module not loaded yet');
        }
    },
    initNow: () => {
        if (typeof window.initStatsUI === 'function') {
            window.initStatsUI();
            return true;
        } else if (window.VinylStatsUI && typeof window.VinylStatsUI.initStatsUI === 'function') {
            window.VinylStatsUI.initStatsUI();
            return true;
        }
        return false;
    }
};
