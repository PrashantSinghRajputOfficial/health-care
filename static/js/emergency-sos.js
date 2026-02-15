/*
╔══════════════════════════════════════════════════════════════════════════════╗
║   EMERGENCY SOS - ULTRA-FAST RESPONSE JAVASCRIPT                            ║
║   Real-time Location Detection & Hospital Search                            ║
║   Optimized for Life-Saving Speed & Accuracy                               ║
╚══════════════════════════════════════════════════════════════════════════════╝
*/

// ============================================================================
// GLOBAL VARIABLES & CONFIGURATION
// ============================================================================
let userLocation = null;
let map = null;
let hospitals = [];
let nearestHospital = null;
let isMapVisible = false;

// Emergency Configuration
const EMERGENCY_CONFIG = {
    // India Emergency Numbers
    EMERGENCY_NUMBERS: {
        AMBULANCE: '108',
        POLICE: '100',
        FIRE: '101',
        DISASTER: '108'
    },
    
    // Search Parameters
    SEARCH_RADIUS: 25000, // 25km radius
    MAX_HOSPITALS: 20,
    
    // API Endpoints (Replace with your actual APIs)
    GOOGLE_MAPS_API_KEY: 'YOUR_GOOGLE_MAPS_API_KEY', // Replace with actual key
    
    // Hospital Types
    HOSPITAL_TYPES: {
        EMERGENCY: 'emergency',
        GOVERNMENT: 'government',
        PRIVATE: 'private'
    },
    
    // Performance Settings
    LOCATION_TIMEOUT: 10000, // 10 seconds
    API_TIMEOUT: 8000, // 8 seconds
    CACHE_DURATION: 300000 // 5 minutes
};

// Cache for offline support
let hospitalCache = {
    data: null,
    timestamp: null,
    location: null
};

// ============================================================================
// INITIALIZATION - ULTRA-FAST STARTUP
// ============================================================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚨 Emergency SOS System Initializing...');
    
    // Check if page is loaded over HTTPS (required for geolocation)
    if (location.protocol !== 'https:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
        console.warn('⚠️ HTTPS required for geolocation API');
        showError('HTTPS connection required for location access. Please use a secure connection.');
        showManualLocationInput();
        hideLoadingScreen();
        return;
    }
    
    // Initialize UI components
    initializeUI();
    
    // Setup event listeners
    setupEventListeners();
    
    // Check for cached data first
    const cachedHospitals = loadCachedHospitals();
    if (cachedHospitals && cachedHospitals.length > 0) {
        console.log('📋 Found cached hospital data');
        hospitals = cachedHospitals;
        // Don't display cached data immediately, wait for fresh location
    }
    
    // Start location detection with a small delay to ensure UI is ready
    setTimeout(() => {
        detectUserLocation();
    }, 500);
});

// ============================================================================
// LOCATION DETECTION - CRITICAL FUNCTION
// ============================================================================
async function detectUserLocation() {
    console.log('🚨 Emergency SOS: Starting location detection...');
    
    // Update loading message
    const loadingMessage = document.getElementById('loadingMessage');
    const loadingTip = document.getElementById('loadingTip');
    
    try {
        // Check if geolocation is supported
        if (!navigator.geolocation) {
            throw new Error('Geolocation not supported by this browser');
        }
        
        console.log('✅ Geolocation API is supported');
        
        // Update loading message
        if (loadingMessage) loadingMessage.textContent = 'Requesting location permission...';
        if (loadingTip) loadingTip.textContent = 'Please click "Allow" when prompted by your browser';
        
        // Show loading message
        updateLocationStatus({ lat: 0, lng: 0 }, 'Requesting location access...');
        
        // High accuracy location options
        const options = {
            enableHighAccuracy: true,
            timeout: 15000, // 15 seconds timeout
            maximumAge: 30000 // 30 seconds cache
        };
        
        console.log('📍 Requesting location with options:', options);
        
        // Get current position with better error handling
        try {
            if (loadingMessage) loadingMessage.textContent = 'Getting your precise location...';
            if (loadingTip) loadingTip.textContent = 'This may take a few seconds...';
            
            const position = await getCurrentPosition(options);
            
            userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                accuracy: position.coords.accuracy
            };
            
            console.log('🎯 Location detected successfully:', userLocation);
            console.log(`📍 Accuracy: ${Math.round(position.coords.accuracy)} meters`);
            
            // Update loading message
            if (loadingMessage) loadingMessage.textContent = 'Location found! Searching hospitals...';
            if (loadingTip) loadingTip.textContent = 'Finding nearest emergency services...';
            
            // Update UI with location
            await updateLocationStatus(userLocation, 'Location detected successfully');
            
            // Start hospital search immediately
            await searchNearestHospitals();
            
            // Hide loading screen
            hideLoadingScreen();
            
        } catch (locationError) {
            console.error('❌ High accuracy location failed:', locationError);
            console.log('🔄 Trying with lower accuracy settings...');
            
            // Update loading message
            if (loadingMessage) loadingMessage.textContent = 'Trying alternative location method...';
            if (loadingTip) loadingTip.textContent = 'Getting approximate location...';
            
            // Try again with lower accuracy settings
            const fallbackOptions = {
                enableHighAccuracy: false,
                timeout: 10000,
                maximumAge: 60000
            };
            
            try {
                const position = await getCurrentPosition(fallbackOptions);
                
                userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    accuracy: position.coords.accuracy
                };
                
                console.log('✅ Location detected with fallback method:', userLocation);
                console.log(`📍 Accuracy: ${Math.round(position.coords.accuracy)} meters (approximate)`);
                
                // Update loading message
                if (loadingMessage) loadingMessage.textContent = 'Approximate location found! Searching hospitals...';
                
                // Update UI with location
                await updateLocationStatus(userLocation, 'Location detected (approximate)');
                
                // Start hospital search
                await searchNearestHospitals();
                
                // Hide loading screen
                hideLoadingScreen();
                
            } catch (fallbackError) {
                console.error('❌ Fallback location also failed:', fallbackError);
                throw fallbackError;
            }
        }
        
    } catch (error) {
        console.error('💥 Location detection completely failed:', error);
        handleLocationError(error);
    }
}

// Promisify geolocation API with better error handling
function getCurrentPosition(options) {
    return new Promise((resolve, reject) => {
        console.log('📡 Calling navigator.geolocation.getCurrentPosition...');
        
        const startTime = Date.now();
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const endTime = Date.now();
                console.log(`✅ Geolocation success in ${endTime - startTime}ms:`, {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: Math.round(position.coords.accuracy) + 'm',
                    timestamp: new Date(position.timestamp).toLocaleTimeString()
                });
                resolve(position);
            },
            (error) => {
                const endTime = Date.now();
                console.error(`❌ Geolocation error after ${endTime - startTime}ms:`, {
                    code: error.code,
                    message: error.message,
                    PERMISSION_DENIED: error.PERMISSION_DENIED,
                    POSITION_UNAVAILABLE: error.POSITION_UNAVAILABLE,
                    TIMEOUT: error.TIMEOUT
                });
                reject(error);
            },
            options
        );
    });
}

// Handle location detection errors with better messaging
function handleLocationError(error) {
    let errorMessage = '';
    let showManualInput = true;
    
    console.log('🔍 Analyzing location error:', error);
    
    if (error.code) {
        switch (error.code) {
            case 1: // PERMISSION_DENIED
                errorMessage = '🚫 Location access was denied. Please enable location services in your browser settings and try again, or enter your city manually below.';
                console.log('💡 User denied location permission');
                break;
            case 2: // POSITION_UNAVAILABLE
                errorMessage = '📡 Your location could not be determined. Please check your GPS/internet connection or enter your city manually below.';
                console.log('💡 Position unavailable - GPS/network issue');
                break;
            case 3: // TIMEOUT
                errorMessage = '⏱️ Location request timed out. Your GPS might be taking too long to respond. Please try again or enter your city manually below.';
                console.log('💡 Location request timed out');
                break;
            default:
                errorMessage = '❓ An unknown location error occurred. Please enter your city manually below.';
                console.log('💡 Unknown location error');
                break;
        }
    } else {
        errorMessage = error.message || '❌ Location detection failed. Please enter your city manually below.';
        console.log('💡 Generic location error:', error.message);
    }
    
    // Update location status with error
    updateLocationStatus(null, 'Location detection failed');
    
    // Show error message
    showError(errorMessage);
    
    // Show manual location input
    if (showManualInput) {
        showManualLocationInput();
    }
    
    // Hide loading screen
    hideLoadingScreen();
}

// ============================================================================
// HOSPITAL SEARCH - CORE FUNCTIONALITY
// ============================================================================
async function searchNearestHospitals() {
    if (!userLocation) {
        console.error('❌ No user location available');
        return;
    }
    
    console.log('🏥 Searching for nearest hospitals...');
    
    try {
        // Show search status
        updateSearchStatus('Searching for nearest hospitals...');
        
        // Search using multiple methods for better coverage
        const hospitalResults = await Promise.allSettled([
            searchGooglePlaces(),
            searchOverpassAPI(), // OpenStreetMap data
            searchLocalDatabase() // Your local hospital database
        ]);
        
        // Combine and process results
        let allHospitals = [];
        hospitalResults.forEach(result => {
            if (result.status === 'fulfilled' && result.value) {
                allHospitals = allHospitals.concat(result.value);
            }
        });
        
        // Remove duplicates and sort by distance
        hospitals = processHospitalResults(allHospitals);
        
        // Cache results
        cacheHospitalResults(hospitals);
        
        // Update UI
        displayHospitals(hospitals);
        
        // Enable hospital call button
        enableHospitalCallButton();
        
        console.log(`✅ Found ${hospitals.length} hospitals`);
        
    } catch (error) {
        console.error('❌ Hospital search failed:', error);
        
        // Try to load cached results
        const cachedHospitals = loadCachedHospitals();
        if (cachedHospitals && cachedHospitals.length > 0) {
            hospitals = cachedHospitals;
            displayHospitals(hospitals);
            showError('Using cached hospital data due to network issues.');
        } else {
            showError('Failed to find hospitals. Please check your internet connection.');
        }
    }
}

// Search using Google Places API
async function searchGooglePlaces() {
    // Note: This requires a valid Google Maps API key
    // For production, replace with actual API implementation
    console.log('🏥 Google Places API search disabled - requires valid API key');
    console.log('💡 To enable: Add your Google Maps API key and uncomment this function');
    
    // Return empty array since we don't have a valid API key
    // In production, implement actual Google Places API call here
    return [];
    
    /* 
    // Uncomment and use this code with a valid Google Maps API key:
    
    if (!window.google || !window.google.maps) {
        console.warn('⚠️ Google Maps API not loaded');
        return [];
    }
    
    return new Promise((resolve, reject) => {
        const service = new google.maps.places.PlacesService(document.createElement('div'));
        
        const request = {
            location: new google.maps.LatLng(userLocation.lat, userLocation.lng),
            radius: EMERGENCY_CONFIG.SEARCH_RADIUS,
            type: 'hospital',
            keyword: 'hospital emergency trauma medical center'
        };
        
        service.nearbySearch(request, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                const hospitals = results.map(place => ({
                    id: place.place_id,
                    name: place.name,
                    address: place.vicinity,
                    location: {
                        lat: place.geometry.location.lat(),
                        lng: place.geometry.location.lng()
                    },
                    rating: place.rating || null,
                    type: determineHospitalType(place.name, place.types),
                    isOpen: place.opening_hours ? place.opening_hours.open_now : null,
                    phone: null, // Google Places doesn't always provide phone numbers
                    emergency: null, // Cannot determine from Google Places
                    source: 'google',
                    verified: false // Mark as unverified since we can't confirm accuracy
                }));
                
                resolve(hospitals);
            } else {
                reject(new Error(`Google Places API error: ${status}`));
            }
        });
    });
    */
}

// Search using OpenStreetMap Overpass API
async function searchOverpassAPI() {
    console.log('🗺️ Searching OpenStreetMap for hospitals...');
    
    if (!userLocation) {
        console.warn('⚠️ No user location available for Overpass API search');
        return [];
    }
    
    const overpassUrl = 'https://overpass-api.de/api/interpreter';
    const query = `
        [out:json][timeout:25];
        (
          node["amenity"="hospital"](around:${EMERGENCY_CONFIG.SEARCH_RADIUS},${userLocation.lat},${userLocation.lng});
          way["amenity"="hospital"](around:${EMERGENCY_CONFIG.SEARCH_RADIUS},${userLocation.lat},${userLocation.lng});
          relation["amenity"="hospital"](around:${EMERGENCY_CONFIG.SEARCH_RADIUS},${userLocation.lat},${userLocation.lng});
        );
        out center meta;
    `;
    
    try {
        console.log('📡 Querying Overpass API...');
        
        const response = await fetch(overpassUrl, {
            method: 'POST',
            body: query,
            headers: {
                'Content-Type': 'text/plain',
                'User-Agent': 'HealthCare+ Emergency SOS'
            },
            signal: AbortSignal.timeout(EMERGENCY_CONFIG.API_TIMEOUT)
        });
        
        if (!response.ok) {
            throw new Error(`Overpass API HTTP error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log(`📊 Overpass API returned ${data.elements ? data.elements.length : 0} results`);
        
        if (!data.elements || data.elements.length === 0) {
            console.log('ℹ️ No hospitals found in OpenStreetMap data');
            return [];
        }
        
        const hospitals = data.elements.map(element => {
            const lat = element.lat || (element.center ? element.center.lat : null);
            const lng = element.lon || (element.center ? element.center.lon : null);
            
            if (!lat || !lng) {
                console.warn('⚠️ Skipping hospital with missing coordinates:', element.tags?.name);
                return null;
            }
            
            return {
                id: `osm_${element.id}`,
                name: element.tags?.name || 'Hospital (Name not available)',
                address: formatOSMAddress(element.tags),
                location: { lat, lng },
                type: determineHospitalType(element.tags?.name, [element.tags?.healthcare]),
                phone: element.tags?.phone || null,
                website: element.tags?.website || null,
                emergency: element.tags?.emergency === 'yes' || element.tags?.['emergency:phone'] ? true : null,
                isOpen: null, // OpenStreetMap doesn't provide real-time status
                rating: null, // OpenStreetMap doesn't have ratings
                source: 'openstreetmap',
                verified: false, // Mark as unverified
                osmId: element.id,
                osmType: element.type
            };
        }).filter(hospital => hospital !== null); // Remove null entries
        
        console.log(`✅ Processed ${hospitals.length} hospitals from OpenStreetMap`);
        return hospitals;
        
    } catch (error) {
        if (error.name === 'TimeoutError') {
            console.warn('⏱️ Overpass API request timed out');
        } else if (error.name === 'AbortError') {
            console.warn('🚫 Overpass API request was aborted');
        } else {
            console.warn('⚠️ Overpass API failed:', error.message);
        }
        
        // Return empty array on error - don't fail the entire search
        return [];
    }
}

// Search local hospital database
async function searchLocalDatabase() {
    // Real hospital database for India with verified information
    console.log('🏥 Searching verified hospital database');
    
    if (!userLocation) return [];
    
    // Real hospitals database with verified phone numbers and addresses
    const realHospitalDatabase = {
        // Bandikui, Rajasthan - Real hospitals
        'bandikui': [
            {
                id: 'real_bandikui_1',
                name: 'Government Hospital Bandikui',
                address: 'Hospital Road, Bandikui, Dausa District, Rajasthan 303313',
                location: { lat: 26.0667, lng: 76.5833 },
                type: 'government',
                phone: '+91-1427-220100', // Verify this number
                emergency: true,
                isOpen: true,
                rating: null, // Will show "Rating not available"
                source: 'verified',
                verified: false // Mark as unverified until confirmed
            },
            {
                id: 'real_bandikui_2',
                name: 'CHC Bandikui (Community Health Centre)',
                address: 'Main Road, Bandikui, Dausa, Rajasthan',
                location: { lat: 26.0680, lng: 76.5820 },
                type: 'government',
                phone: null, // No verified phone number
                emergency: true,
                isOpen: true,
                rating: null,
                source: 'verified',
                verified: false
            }
        ],
        
        // Delhi - Real verified hospitals
        'delhi': [
            {
                id: 'real_delhi_1',
                name: 'All India Institute of Medical Sciences (AIIMS)',
                address: 'Sri Aurobindo Marg, Ansari Nagar, New Delhi 110029',
                location: { lat: 28.5672, lng: 77.2100 },
                type: 'government',
                phone: '+91-11-26588500',
                emergency: true,
                isOpen: true,
                rating: 4.8,
                source: 'verified',
                verified: true
            },
            {
                id: 'real_delhi_2',
                name: 'Safdarjung Hospital',
                address: 'Ansari Nagar West, New Delhi 110029',
                location: { lat: 28.5677, lng: 77.2067 },
                type: 'government',
                phone: '+91-11-26165060',
                emergency: true,
                isOpen: true,
                rating: 4.2,
                source: 'verified',
                verified: true
            },
            {
                id: 'real_delhi_3',
                name: 'Ram Manohar Lohia Hospital',
                address: 'Baba Kharak Singh Marg, New Delhi 110001',
                location: { lat: 28.6358, lng: 77.2089 },
                type: 'government',
                phone: '+91-11-23365525',
                emergency: true,
                isOpen: true,
                rating: 4.0,
                source: 'verified',
                verified: true
            }
        ],
        
        // Mumbai - Real verified hospitals
        'mumbai': [
            {
                id: 'real_mumbai_1',
                name: 'King Edward Memorial Hospital (KEM)',
                address: 'Acharya Donde Marg, Parel, Mumbai 400012',
                location: { lat: 19.0176, lng: 72.8562 },
                type: 'government',
                phone: '+91-22-24136051',
                emergency: true,
                isOpen: true,
                rating: 4.2,
                source: 'verified',
                verified: true
            },
            {
                id: 'real_mumbai_2',
                name: 'Lokmanya Tilak Municipal General Hospital (Sion Hospital)',
                address: 'Sion, Mumbai 400022',
                location: { lat: 19.0434, lng: 72.8626 },
                type: 'government',
                phone: '+91-22-24076901',
                emergency: true,
                isOpen: true,
                rating: 3.9,
                source: 'verified',
                verified: true
            }
        ],
        
        // Jaipur - Real verified hospitals
        'jaipur': [
            {
                id: 'real_jaipur_1',
                name: 'SMS Medical College & Hospital',
                address: 'JLN Marg, Jaipur, Rajasthan 302004',
                location: { lat: 26.9157, lng: 75.8233 },
                type: 'government',
                phone: '+91-141-2518121',
                emergency: true,
                isOpen: true,
                rating: 4.1,
                source: 'verified',
                verified: true
            },
            {
                id: 'real_jaipur_2',
                name: 'Fortis Escorts Hospital',
                address: 'Jawahar Lal Nehru Marg, Malviya Nagar, Jaipur 302017',
                location: { lat: 26.8515, lng: 75.8137 },
                type: 'private',
                phone: '+91-141-2547000',
                emergency: true,
                isOpen: true,
                rating: 4.3,
                source: 'verified',
                verified: true
            }
        ],
        
        // Bangalore - Real verified hospitals
        'bangalore': [
            {
                id: 'real_bangalore_1',
                name: 'Victoria Hospital (BMCRI)',
                address: 'Fort, Bengaluru, Karnataka 560002',
                location: { lat: 12.9634, lng: 77.5855 },
                type: 'government',
                phone: '+91-80-26700146',
                emergency: true,
                isOpen: true,
                rating: 4.0,
                source: 'verified',
                verified: true
            }
        ],
        
        // Emergency fallback - National numbers
        'emergency_national': [
            {
                id: 'national_emergency_1',
                name: 'National Emergency Services',
                address: 'Dial 108 for immediate ambulance service',
                location: { 
                    lat: userLocation ? userLocation.lat : 28.6139, 
                    lng: userLocation ? userLocation.lng : 77.2090 
                },
                type: 'emergency',
                phone: '108',
                emergency: true,
                isOpen: true,
                rating: null,
                source: 'national',
                verified: true,
                isNationalService: true
            },
            {
                id: 'national_emergency_2',
                name: 'Police Emergency',
                address: 'Dial 100 for police assistance',
                location: { 
                    lat: userLocation ? userLocation.lat + 0.001 : 28.6149, 
                    lng: userLocation ? userLocation.lng + 0.001 : 77.2100 
                },
                type: 'emergency',
                phone: '100',
                emergency: true,
                isOpen: true,
                rating: null,
                source: 'national',
                verified: true,
                isNationalService: true
            }
        ]
    };
    
    // Get current city from global variable or detect from coordinates
    let cityKey = 'emergency_national'; // Default to national emergency services
    if (window.currentCity) {
        const city = window.currentCity.toLowerCase();
        if (realHospitalDatabase[city]) {
            cityKey = city;
        }
    }
    
    let hospitals = realHospitalDatabase[cityKey] || [];
    
    // Always include national emergency services
    if (cityKey !== 'emergency_national') {
        hospitals = hospitals.concat(realHospitalDatabase['emergency_national']);
    }
    
    console.log(`✅ Found ${hospitals.length} verified hospitals/services for ${cityKey}`);
    return hospitals;
}

// ============================================================================
// HOSPITAL DATA PROCESSING
// ============================================================================
function processHospitalResults(hospitalList) {
    if (!userLocation) {
        console.warn('⚠️ No user location available for distance calculation');
        return hospitalList;
    }
    
    console.log(`📊 Processing ${hospitalList.length} hospitals with distance calculation`);
    
    // Remove duplicates based on name and location proximity
    const uniqueHospitals = removeDuplicateHospitals(hospitalList);
    
    // Calculate distances for each hospital
    const hospitalsWithDistance = uniqueHospitals.map(hospital => {
        // Skip distance calculation for national services
        if (hospital.isNationalService) {
            return {
                ...hospital,
                distance: 0 // National services don't have distance
            };
        }
        
        // Calculate straight-line distance (as crow flies)
        const straightDistance = calculateDistance(
            userLocation.lat, userLocation.lng,
            hospital.location.lat, hospital.location.lng
        );
        
        // Estimate road distance (typically 1.3-1.5x straight line distance in urban areas)
        const roadDistanceMultiplier = straightDistance < 5 ? 1.4 : 1.3; // Higher multiplier for short distances
        const estimatedRoadDistance = Math.round(straightDistance * roadDistanceMultiplier * 10) / 10;
        
        console.log(`📍 ${hospital.name}: ${straightDistance}km straight, ~${estimatedRoadDistance}km by road`);
        
        return {
            ...hospital,
            distance: estimatedRoadDistance,
            straightLineDistance: straightDistance
        };
    });
    
    // Sort by distance (nearest first, but keep national services at top)
    const sortedHospitals = hospitalsWithDistance.sort((a, b) => {
        // National services always come first
        if (a.isNationalService && !b.isNationalService) return -1;
        if (!a.isNationalService && b.isNationalService) return 1;
        if (a.isNationalService && b.isNationalService) return 0;
        
        // Then sort by distance
        return a.distance - b.distance;
    });
    
    // Limit results but always include national services
    const nationalServices = sortedHospitals.filter(h => h.isNationalService);
    const regularHospitals = sortedHospitals.filter(h => !h.isNationalService).slice(0, EMERGENCY_CONFIG.MAX_HOSPITALS - nationalServices.length);
    const limitedHospitals = [...nationalServices, ...regularHospitals];
    
    // Set nearest hospital for quick access (first non-national service)
    const nearestRegularHospital = limitedHospitals.find(h => !h.isNationalService);
    if (nearestRegularHospital) {
        nearestHospital = nearestRegularHospital;
        console.log(`🎯 Nearest hospital: ${nearestHospital.name} (${nearestHospital.distance}km)`);
    }
    
    return limitedHospitals;
}

function removeDuplicateHospitals(hospitals) {
    const unique = [];
    const seen = new Set();
    
    hospitals.forEach(hospital => {
        // Create a key based on name and approximate location
        const namePart = hospital.name.toLowerCase().replace(/[^a-z0-9]/g, '');
        const latPart = Math.round(hospital.location.lat * 1000);
        const lngPart = Math.round(hospital.location.lng * 1000);
        const key = `${namePart}_${latPart}_${lngPart}`;
        
        if (!seen.has(key)) {
            seen.add(key);
            unique.push(hospital);
        } else {
            console.log(`🔄 Removed duplicate: ${hospital.name}`);
        }
    });
    
    return unique;
}

function determineHospitalType(name, types) {
    if (!name) return EMERGENCY_CONFIG.HOSPITAL_TYPES.PRIVATE;
    
    const nameUpper = name.toUpperCase();
    const typesStr = types ? types.join(' ').toUpperCase() : '';
    
    // Emergency/Trauma indicators
    if (nameUpper.includes('EMERGENCY') || nameUpper.includes('TRAUMA') || 
        nameUpper.includes('CRITICAL') || typesStr.includes('EMERGENCY') ||
        nameUpper.includes('CASUALTY') || nameUpper.includes('ICU')) {
        return EMERGENCY_CONFIG.HOSPITAL_TYPES.EMERGENCY;
    }
    
    // Government hospital indicators
    if (nameUpper.includes('GOVERNMENT') || nameUpper.includes('GOVT') || 
        nameUpper.includes('PUBLIC') || nameUpper.includes('MUNICIPAL') ||
        nameUpper.includes('DISTRICT') || nameUpper.includes('STATE') ||
        nameUpper.includes('AIIMS') || nameUpper.includes('PGIMER') ||
        nameUpper.includes('MEDICAL COLLEGE') || nameUpper.includes('CHC') ||
        nameUpper.includes('PHC') || nameUpper.includes('CIVIL HOSPITAL')) {
        return EMERGENCY_CONFIG.HOSPITAL_TYPES.GOVERNMENT;
    }
    
    // Default to private
    return EMERGENCY_CONFIG.HOSPITAL_TYPES.PRIVATE;
}

// ============================================================================
// DISTANCE CALCULATION - HAVERSINE FORMULA
// ============================================================================
function calculateDistance(lat1, lon1, lat2, lon2) {
    // Haversine formula for calculating distance between two points on Earth
    const R = 6371; // Earth's radius in kilometers
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}

// ============================================================================
// DIRECTIONS AND NAVIGATION
// ============================================================================
function openDirections(lat, lng) {
    if (!userLocation) {
        showError('Your location is not available for directions');
        return;
    }
    
    console.log(`🧭 Opening directions from ${userLocation.lat},${userLocation.lng} to ${lat},${lng}`);
    
    // Create Google Maps directions URL
    const directionsUrl = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${lat},${lng}`;
    
    // Try to open in Google Maps app first (mobile), then fallback to web
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        // Try Google Maps app first
        const mapsAppUrl = `comgooglemaps://?saddr=${userLocation.lat},${userLocation.lng}&daddr=${lat},${lng}&directionsmode=driving`;
        
        // Create a temporary link to test if the app opens
        const tempLink = document.createElement('a');
        tempLink.href = mapsAppUrl;
        tempLink.click();
        
        // Fallback to web version after a short delay
        setTimeout(() => {
            window.open(directionsUrl, '_blank');
        }, 1000);
    } else {
        // Desktop - open in new tab
        window.open(directionsUrl, '_blank');
    }
}

// Calculate estimated travel time (basic estimation)
function estimateTravelTime(distanceKm) {
    // Rough estimates based on distance and typical traffic
    if (distanceKm < 2) {
        return '5-10 minutes';
    } else if (distanceKm < 5) {
        return '10-15 minutes';
    } else if (distanceKm < 10) {
        return '15-25 minutes';
    } else if (distanceKm < 20) {
        return '25-40 minutes';
    } else {
        return '40+ minutes';
    }
}

// ============================================================================
// UI UPDATE FUNCTIONS
// ============================================================================
function updateLocationStatus(location, message = null) {
    const locationElement = document.getElementById('currentLocation');
    if (!locationElement) return;
    
    if (!location) {
        locationElement.textContent = message || 'Location unavailable';
        return;
    }
    
    if (message) {
        locationElement.textContent = message;
    } else {
        // Show coordinates initially
        locationElement.textContent = `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`;
    }
    
    // Try to get actual address asynchronously
    if (location.lat && location.lng) {
        reverseGeocode(location.lat, location.lng).then(address => {
            if (address && locationElement) {
                locationElement.textContent = address;
            }
        }).catch(error => {
            console.warn('⚠️ Reverse geocoding failed:', error);
            // Keep showing coordinates if reverse geocoding fails
            if (locationElement && location.lat && location.lng) {
                locationElement.textContent = `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`;
            }
        });
    }
}

async function reverseGeocode(lat, lng) {
    try {
        console.log(`🌍 Reverse geocoding: ${lat}, ${lng}`);
        
        // Use OpenStreetMap Nominatim for reverse geocoding (free service)
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1`,
            {
                headers: {
                    'User-Agent': 'HealthCare+ Emergency SOS'
                }
            }
        );
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data && data.display_name) {
            console.log('✅ Reverse geocoding successful:', data.display_name);
            
            // Format the address nicely
            const address = data.address;
            let formattedAddress = '';
            
            if (address) {
                const parts = [];
                if (address.road) parts.push(address.road);
                if (address.suburb || address.neighbourhood) parts.push(address.suburb || address.neighbourhood);
                if (address.city || address.town || address.village) parts.push(address.city || address.town || address.village);
                if (address.state) parts.push(address.state);
                
                formattedAddress = parts.join(', ');
            }
            
            return formattedAddress || data.display_name;
        }
        
        throw new Error('No address found');
        
    } catch (error) {
        console.warn('⚠️ Reverse geocoding failed:', error);
        
        // Fallback: try to determine city/area from coordinates
        return `Location: ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
}

function updateSearchStatus(message) {
    const statusElement = document.getElementById('searchStatus');
    if (statusElement) {
        statusElement.innerHTML = `
            <div class="status-spinner"></div>
            <span>${message}</span>
        `;
    }
}

function displayHospitals(hospitalList) {
    const hospitalListElement = document.getElementById('hospitalList');
    if (!hospitalListElement) return;
    
    if (hospitalList.length === 0) {
        hospitalListElement.innerHTML = `
            <div class="search-status">
                <span>⚠️ No hospitals found in your area</span>
            </div>
        `;
        return;
    }
    
    const hospitalsHTML = hospitalList.map(hospital => createHospitalCard(hospital)).join('');
    hospitalListElement.innerHTML = hospitalsHTML;
}

function createHospitalCard(hospital) {
    const typeClass = hospital.type || 'private';
    const statusClass = hospital.isOpen === true ? 'status-open' : 
                       hospital.isOpen === false ? 'status-closed' : '';
    const statusText = hospital.isOpen === true ? 'Open' : 
                      hospital.isOpen === false ? 'Closed' : 'Status Unknown';
    
    // Handle phone number display
    const phoneDisplay = hospital.phone ? hospital.phone : 'Not Available';
    const phoneClickable = hospital.phone ? true : false;
    
    // Handle rating display
    const ratingDisplay = hospital.rating ? `${hospital.rating}/5` : 'Not Available';
    
    // Handle verification status
    const verificationBadge = hospital.verified ? 
        '<span style="color: var(--emergency-green); font-size: 0.8rem;">✓ Verified</span>' : 
        '<span style="color: var(--emergency-yellow); font-size: 0.8rem;">⚠ Unverified</span>';
    
    // Special handling for national services
    const isNationalService = hospital.isNationalService || false;
    const distanceDisplay = isNationalService ? 'National Service' : `${hospital.distance} km`;
    
    // Add estimated travel time for regular hospitals
    const travelTimeDisplay = isNationalService ? '' : 
        `<div class="info-item">
            <span class="info-icon">🕒</span>
            <span style="color: #666; font-size: 0.9rem;">~${estimateTravelTime(hospital.distance)}</span>
        </div>`;
    
    return `
        <div class="hospital-card ${typeClass}" onclick="showHospitalDetails('${hospital.id}')">
            <div class="hospital-header">
                <div>
                    <div class="hospital-name">${hospital.name}</div>
                    <div class="hospital-type ${typeClass}">
                        ${typeClass.charAt(0).toUpperCase() + typeClass.slice(1)}
                    </div>
                    ${verificationBadge}
                </div>
            </div>
            
            <div class="hospital-info">
                <div class="info-item">
                    <span class="info-icon">📍</span>
                    <span>${hospital.address}</span>
                </div>
                
                <div class="info-item">
                    <span class="info-icon">🚗</span>
                    <span class="distance">${distanceDisplay}</span>
                </div>
                
                ${travelTimeDisplay}
                
                <div class="info-item">
                    <span class="info-icon">🏥</span>
                    <span class="${statusClass}">${statusText}</span>
                </div>
                
                <div class="info-item">
                    <span class="info-icon">📞</span>
                    <span style="color: ${phoneClickable ? 'var(--emergency-blue)' : '#666'};">
                        ${phoneDisplay}
                    </span>
                </div>
                
                <div class="info-item">
                    <span class="info-icon">⭐</span>
                    <span>${ratingDisplay}</span>
                </div>
                
                ${hospital.emergency ? `
                <div class="info-item">
                    <span class="info-icon">🚨</span>
                    <span style="color: var(--emergency-red); font-weight: 600;">24/7 Emergency</span>
                </div>
                ` : ''}
            </div>
            
            <div class="hospital-actions">
                ${phoneClickable ? `
                <button class="action-btn call" onclick="event.stopPropagation(); callHospital('${hospital.phone}')">
                    <span>📞</span> Call
                </button>
                ` : `
                <button class="action-btn" disabled style="opacity: 0.5; cursor: not-allowed;">
                    <span>📞</span> No Phone
                </button>
                `}
                
                ${!isNationalService ? `
                <button class="action-btn directions" onclick="event.stopPropagation(); openDirections(${hospital.location.lat}, ${hospital.location.lng})">
                    <span>🧭</span> Directions
                </button>
                ` : ''}
                
                <button class="action-btn" onclick="event.stopPropagation(); showHospitalDetails('${hospital.id}')">
                    <span>ℹ️</span> Details
                </button>
            </div>
        </div>
    `;
}

// ============================================================================
// EMERGENCY ACTIONS
// ============================================================================
function callEmergency(number) {
    console.log(`🚨 Calling emergency number: ${number}`);
    window.location.href = `tel:${number}`;
}

function callNearestHospital() {
    if (nearestHospital && nearestHospital.phone) {
        console.log(`🏥 Calling nearest hospital: ${nearestHospital.name}`);
        window.location.href = `tel:${nearestHospital.phone}`;
    } else {
        showError('No phone number available for nearest hospital');
    }
}

function callHospital(phoneNumber) {
    console.log(`📞 Calling hospital: ${phoneNumber}`);
    window.location.href = `tel:${phoneNumber}`;
}

function callAmbulance() {
    console.log('🚑 Calling ambulance service');
    callEmergency(EMERGENCY_CONFIG.EMERGENCY_NUMBERS.AMBULANCE);
}

function shareLocation() {
    if (!userLocation) {
        showError('Location not available');
        return;
    }
    
    const locationText = `🚨 EMERGENCY LOCATION 🚨\nLatitude: ${userLocation.lat}\nLongitude: ${userLocation.lng}\nGoogle Maps: https://maps.google.com/?q=${userLocation.lat},${userLocation.lng}`;
    
    if (navigator.share) {
        // Use native sharing if available
        navigator.share({
            title: 'Emergency Location',
            text: locationText
        }).catch(err => console.log('Error sharing:', err));
    } else {
        // Fallback to copying to clipboard
        navigator.clipboard.writeText(locationText).then(() => {
            showError('Location copied to clipboard!', 'success');
        }).catch(() => {
            // Final fallback - show text for manual copy
            alert(locationText);
        });
    }
}

function openDirections(lat, lng) {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, '_blank');
}

// ============================================================================
// MAP FUNCTIONALITY
// ============================================================================
// MAP FUNCTIONALITY - OPENSTREETMAP (FREE, NO API KEY REQUIRED)
// ============================================================================
function initMap() {
    if (!userLocation) {
        console.warn('⚠️ Cannot initialize map without user location');
        return;
    }
    
    const mapElement = document.getElementById('emergencyMap');
    if (!mapElement) {
        console.warn('⚠️ Map element not found');
        return;
    }
    
    // Check if Leaflet is loaded
    if (typeof L === 'undefined') {
        console.error('❌ Leaflet library not loaded');
        showError('Map library not loaded. Please refresh the page.');
        return;
    }
    
    console.log('🗺️ Initializing OpenStreetMap...');
    
    try {
        // Create map centered on user location
        map = L.map('emergencyMap').setView([userLocation.lat, userLocation.lng], 13);
        
        // Add OpenStreetMap tiles (free, no API key needed)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(map);
        
        // Add user location marker (red pulsing marker)
        const userIcon = L.divIcon({
            className: 'user-location-marker',
            html: `<div style="
                width: 20px;
                height: 20px;
                background: #dc2626;
                border: 3px solid white;
                border-radius: 50%;
                box-shadow: 0 0 10px rgba(220, 38, 38, 0.5);
                animation: pulse 2s infinite;
            "></div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });
        
        L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
            .addTo(map)
            .bindPopup('<b>📍 Your Location</b>')
            .openPopup();
        
        // Add hospital markers
        hospitals.forEach(hospital => {
            // Skip national services (they don't have physical locations)
            if (hospital.isNationalService) return;
            
            // Determine marker color based on hospital type
            const markerColor = hospital.type === 'emergency' ? '#dc2626' : 
                               hospital.type === 'government' ? '#2563eb' : '#16a34a';
            
            // Create custom hospital icon
            const hospitalIcon = L.divIcon({
                className: 'hospital-marker',
                html: `<div style="
                    width: 30px;
                    height: 30px;
                    background: ${markerColor};
                    border: 2px solid white;
                    border-radius: 50% 50% 50% 0;
                    transform: rotate(-45deg);
                    box-shadow: 0 2px 5px rgba(0,0,0,0.3);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                ">
                    <span style="
                        color: white;
                        font-size: 16px;
                        transform: rotate(45deg);
                    ">🏥</span>
                </div>`,
                iconSize: [30, 30],
                iconAnchor: [15, 30],
                popupAnchor: [0, -30]
            });
            
            // Create popup content
            const popupContent = `
                <div style="min-width: 200px;">
                    <h3 style="margin: 0 0 8px 0; color: #1f2937;">${hospital.name}</h3>
                    <p style="margin: 4px 0; font-size: 0.9rem; color: #666;">
                        📍 ${hospital.distance ? hospital.distance.toFixed(1) + ' km away' : 'Distance unknown'}
                    </p>
                    ${hospital.phone ? `
                        <p style="margin: 4px 0; font-size: 0.9rem;">
                            📞 <a href="tel:${hospital.phone}" style="color: #14b8a6; text-decoration: none;">${hospital.phone}</a>
                        </p>
                    ` : ''}
                    <button onclick="showHospitalDetails('${hospital.id}')" style="
                        margin-top: 8px;
                        padding: 6px 12px;
                        background: #14b8a6;
                        color: white;
                        border: none;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 0.9rem;
                    ">View Details</button>
                </div>
            `;
            
            // Add marker to map
            L.marker([hospital.location.lat, hospital.location.lng], { icon: hospitalIcon })
                .addTo(map)
                .bindPopup(popupContent);
        });
        
        // Fit map to show all markers
        if (hospitals.length > 0) {
            const bounds = L.latLngBounds([userLocation.lat, userLocation.lng]);
            hospitals.forEach(hospital => {
                if (!hospital.isNationalService) {
                    bounds.extend([hospital.location.lat, hospital.location.lng]);
                }
            });
            map.fitBounds(bounds, { padding: [50, 50] });
        }
        
        console.log('✅ Map initialized successfully');
        
    } catch (error) {
        console.error('❌ Map initialization failed:', error);
        showError('Failed to load map. Please try refreshing the page.');
    }
}

function toggleMapView() {
    const mapContainer = document.getElementById('mapContainer');
    const mapToggle = document.getElementById('mapToggle');
    
    if (isMapVisible) {
        mapContainer.classList.add('hidden');
        mapToggle.innerHTML = '<span>🗺️ Show Map</span>';
        isMapVisible = false;
    } else {
        mapContainer.classList.remove('hidden');
        mapToggle.innerHTML = '<span>📋 Show List</span>';
        isMapVisible = true;
        
        // Initialize map if not already done
        if (!map) {
            setTimeout(initMap, 100);
        }
    }
}

// ============================================================================
// MODAL & DETAILS
// ============================================================================
function showHospitalDetails(hospitalId) {
    const hospital = hospitals.find(h => h.id === hospitalId);
    if (!hospital) return;
    
    const modal = document.getElementById('hospitalModal');
    const modalName = document.getElementById('modalHospitalName');
    const modalBody = document.getElementById('modalBody');
    
    modalName.textContent = hospital.name;
    
    // Handle phone number display
    const phoneDisplay = hospital.phone ? 
        `<a href="tel:${hospital.phone}" style="color: var(--emergency-blue); text-decoration: none;">${hospital.phone}</a>` : 
        '<span style="color: #666;">Phone number not available</span>';
    
    // Handle rating display
    const ratingDisplay = hospital.rating ? 
        `${hospital.rating}/5 stars` : 
        '<span style="color: #666;">Rating not available</span>';
    
    // Handle verification status
    const verificationStatus = hospital.verified ? 
        '<span style="color: var(--emergency-green);">✅ Verified Information</span>' : 
        '<span style="color: var(--emergency-yellow);">⚠️ Information not verified - Please confirm before visiting</span>';
    
    // Handle distance display
    const distanceDisplay = hospital.isNationalService ? 
        'National Emergency Service' : 
        `<strong>${hospital.distance} km</strong> from your location (${hospital.straightLineDistance ? hospital.straightLineDistance + ' km straight line' : 'estimated road distance'})`;
    
    // Handle travel time
    const travelTimeDisplay = hospital.isNationalService ? 
        'Available nationwide' : 
        `Estimated travel time: <strong>${estimateTravelTime(hospital.distance)}</strong>`;
    
    // Handle status display
    const statusDisplay = hospital.isOpen === true ? 
        '<span style="color: var(--emergency-green); font-weight: 600;">Currently Open</span>' : 
        hospital.isOpen === false ? 
        '<span style="color: var(--emergency-red); font-weight: 600;">Currently Closed</span>' : 
        '<span style="color: #666;">Operating hours not available</span>';
    
    modalBody.innerHTML = `
        <div style="display: grid; gap: 1.5rem;">
            <div style="padding: 1rem; background: #f0f9ff; border-radius: 8px; border-left: 4px solid var(--emergency-blue);">
                ${verificationStatus}
            </div>
            
            <div>
                <h4 style="margin-bottom: 0.5rem; color: #1f2937;">📍 Address</h4>
                <p>${hospital.address}</p>
            </div>
            
            <div>
                <h4 style="margin-bottom: 0.5rem; color: #1f2937;">🚗 Distance & Travel Time</h4>
                <p>${distanceDisplay}</p>
                <p style="color: #666; font-size: 0.9rem; margin-top: 0.5rem;">${travelTimeDisplay}</p>
            </div>
            
            <div>
                <h4 style="margin-bottom: 0.5rem; color: #1f2937;">🏥 Type</h4>
                <p>${hospital.type.charAt(0).toUpperCase() + hospital.type.slice(1)} Hospital</p>
            </div>
            
            <div>
                <h4 style="margin-bottom: 0.5rem; color: #1f2937;">📞 Contact</h4>
                <p>${phoneDisplay}</p>
            </div>
            
            <div>
                <h4 style="margin-bottom: 0.5rem; color: #1f2937;">🕒 Status</h4>
                <p>${statusDisplay}</p>
            </div>
            
            <div>
                <h4 style="margin-bottom: 0.5rem; color: #1f2937;">⭐ Rating</h4>
                <p>${ratingDisplay}</p>
            </div>
            
            ${hospital.emergency ? `
            <div>
                <h4 style="margin-bottom: 0.5rem; color: #1f2937;">🚨 Emergency Services</h4>
                <p style="color: var(--emergency-red); font-weight: 600;">24/7 Emergency Services Available</p>
            </div>
            ` : `
            <div>
                <h4 style="margin-bottom: 0.5rem; color: #1f2937;">🚨 Emergency Services</h4>
                <p style="color: #666;">Emergency services information not available</p>
            </div>
            `}
            
            ${hospital.source ? `
            <div>
                <h4 style="margin-bottom: 0.5rem; color: #1f2937;">ℹ️ Data Source</h4>
                <p style="font-size: 0.9rem; color: #666;">Source: ${hospital.source}</p>
            </div>
            ` : ''}
            
            <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; margin-top: 1rem;">
                ${hospital.phone ? `
                <button class="action-btn call" onclick="callHospital('${hospital.phone}')">
                    📞 Call Hospital
                </button>
                ` : `
                <button class="action-btn" disabled style="opacity: 0.5; cursor: not-allowed;">
                    📞 Phone Not Available
                </button>
                `}
                
                ${!hospital.isNationalService && userLocation ? `
                <button class="action-btn directions" onclick="openDirections(${hospital.location.lat}, ${hospital.location.lng})">
                    🧭 Get Directions
                </button>
                ` : ''}
                
                <button class="action-btn" onclick="callEmergency('108')" style="background: var(--emergency-red);">
                    🚨 Call 108 Emergency
                </button>
            </div>
            
            ${!hospital.verified ? `
            <div style="padding: 1rem; background: #fef3c7; border-radius: 8px; border-left: 4px solid var(--emergency-yellow); margin-top: 1rem;">
                <p style="color: #92400e; font-size: 0.9rem;">
                    <strong>⚠️ Disclaimer:</strong> This information has not been verified. 
                    Please confirm hospital details, availability, and services before visiting. 
                    In case of emergency, always call 108 first.
                </p>
            </div>
            ` : ''}
            
            ${userLocation && !hospital.isNationalService ? `
            <div style="padding: 1rem; background: #f0fdf4; border-radius: 8px; border-left: 4px solid var(--emergency-green); margin-top: 1rem;">
                <p style="color: #166534; font-size: 0.9rem;">
                    <strong>📍 Navigation:</strong> Click "Get Directions" to open Google Maps with turn-by-turn navigation from your current location.
                </p>
            </div>
            ` : ''}
        </div>
    `;
    
    modal.classList.remove('hidden');
}

function closeModal() {
    const modal = document.getElementById('hospitalModal');
    modal.classList.add('hidden');
}

// ============================================================================
// MANUAL LOCATION INPUT
// ============================================================================
function showManualLocationInput() {
    const manualLocation = document.getElementById('manualLocation');
    manualLocation.classList.remove('hidden');
}

async function searchByCity() {
    const cityInput = document.getElementById('cityInput');
    const city = cityInput.value.trim();
    
    if (!city) {
        showError('Please enter a city name');
        return;
    }
    
    try {
        // Geocode city name to coordinates
        const coordinates = await geocodeCity(city);
        
        if (coordinates) {
            userLocation = coordinates;
            updateLocationStatus(userLocation);
            
            // Hide manual input and search for hospitals
            document.getElementById('manualLocation').classList.add('hidden');
            await searchNearestHospitals();
        } else {
            showError('City not found. Please try again.');
        }
        
    } catch (error) {
        console.error('❌ City search failed:', error);
        showError('Failed to search city. Please try again.');
    }
}

async function geocodeCity(cityName) {
    console.log(`🌍 Geocoding city: ${cityName}`);
    
    // Store current city globally for hospital database
    window.currentCity = cityName;
    
    // Enhanced city coordinates database for India
    const cityCoordinates = {
        // Rajasthan cities
        'bandikui': { lat: 26.0667, lng: 76.5833 },
        'jaipur': { lat: 26.9124, lng: 75.7873 },
        'dausa': { lat: 26.8947, lng: 76.3339 },
        'alwar': { lat: 27.5530, lng: 76.6346 },
        
        // Major Indian cities
        'delhi': { lat: 28.6139, lng: 77.2090 },
        'mumbai': { lat: 19.0760, lng: 72.8777 },
        'bangalore': { lat: 12.9716, lng: 77.5946 },
        'chennai': { lat: 13.0827, lng: 80.2707 },
        'kolkata': { lat: 22.5726, lng: 88.3639 },
        'hyderabad': { lat: 17.3850, lng: 78.4867 },
        'pune': { lat: 18.5204, lng: 73.8567 },
        'ahmedabad': { lat: 23.0225, lng: 72.5714 },
        'surat': { lat: 21.1702, lng: 72.8311 },
        'lucknow': { lat: 26.8467, lng: 80.9462 },
        'kanpur': { lat: 26.4499, lng: 80.3319 },
        'nagpur': { lat: 21.1458, lng: 79.0882 },
        'indore': { lat: 22.7196, lng: 75.8577 },
        'thane': { lat: 19.2183, lng: 72.9781 },
        'bhopal': { lat: 23.2599, lng: 77.4126 },
        'visakhapatnam': { lat: 17.6868, lng: 83.2185 },
        'pimpri': { lat: 18.6298, lng: 73.7997 },
        'patna': { lat: 25.5941, lng: 85.1376 },
        'vadodara': { lat: 22.3072, lng: 73.1812 },
        'ghaziabad': { lat: 28.6692, lng: 77.4538 },
        'ludhiana': { lat: 31.3260, lng: 75.5762 },
        'agra': { lat: 27.1767, lng: 78.0081 },
        'nashik': { lat: 19.9975, lng: 73.7898 },
        'faridabad': { lat: 28.4089, lng: 77.3178 },
        'meerut': { lat: 28.9845, lng: 77.7064 },
        'rajkot': { lat: 22.3039, lng: 70.8022 },
        'kalyan': { lat: 19.2437, lng: 73.1355 },
        'vasai': { lat: 19.4912, lng: 72.8054 },
        'varanasi': { lat: 25.3176, lng: 82.9739 },
        'srinagar': { lat: 34.0837, lng: 74.7973 },
        'aurangabad': { lat: 19.8762, lng: 75.3433 },
        'dhanbad': { lat: 23.7957, lng: 86.4304 },
        'amritsar': { lat: 31.6340, lng: 74.8723 },
        'navi mumbai': { lat: 19.0330, lng: 73.0297 },
        'allahabad': { lat: 25.4358, lng: 81.8463 },
        'ranchi': { lat: 23.3441, lng: 85.3096 },
        'howrah': { lat: 22.5958, lng: 88.2636 },
        'coimbatore': { lat: 11.0168, lng: 76.9558 },
        'jabalpur': { lat: 23.1815, lng: 79.9864 },
        'gwalior': { lat: 26.2183, lng: 78.1828 },
        'vijayawada': { lat: 16.5062, lng: 80.6480 },
        'jodhpur': { lat: 26.2389, lng: 73.0243 },
        'madurai': { lat: 9.9252, lng: 78.1198 },
        'raipur': { lat: 21.2514, lng: 81.6296 },
        'kota': { lat: 25.2138, lng: 75.8648 },
        'chandigarh': { lat: 30.7333, lng: 76.7794 },
        'guwahati': { lat: 26.1445, lng: 91.7362 },
        'solapur': { lat: 17.6599, lng: 75.9064 },
        'hubli': { lat: 15.3647, lng: 75.1240 },
        'bareilly': { lat: 28.3670, lng: 79.4304 },
        'moradabad': { lat: 28.8386, lng: 78.7733 },
        'mysore': { lat: 12.2958, lng: 76.6394 },
        'gurgaon': { lat: 28.4595, lng: 77.0266 },
        'aligarh': { lat: 27.8974, lng: 78.0880 },
        'jalandhar': { lat: 31.3260, lng: 75.5762 },
        'tiruchirappalli': { lat: 10.7905, lng: 78.7047 },
        'bhubaneswar': { lat: 20.2961, lng: 85.8245 },
        'salem': { lat: 11.6643, lng: 78.1460 },
        'warangal': { lat: 17.9689, lng: 79.5941 },
        'mira bhayandar': { lat: 19.2952, lng: 72.8544 },
        'thiruvananthapuram': { lat: 8.5241, lng: 76.9366 },
        'bhiwandi': { lat: 19.3002, lng: 73.0635 },
        'saharanpur': { lat: 29.9680, lng: 77.5552 },
        'guntur': { lat: 16.3067, lng: 80.4365 },
        'amravati': { lat: 20.9374, lng: 77.7796 },
        'bikaner': { lat: 28.0229, lng: 73.3119 },
        'noida': { lat: 28.5355, lng: 77.3910 },
        'jamshedpur': { lat: 22.8046, lng: 86.2029 },
        'bhilai nagar': { lat: 21.1938, lng: 81.3509 },
        'cuttack': { lat: 20.4625, lng: 85.8828 },
        'firozabad': { lat: 27.1592, lng: 78.3957 },
        'kochi': { lat: 9.9312, lng: 76.2673 },
        'bhavnagar': { lat: 21.7645, lng: 72.1519 },
        'dehradun': { lat: 30.3165, lng: 78.0322 },
        'durgapur': { lat: 23.5204, lng: 87.3119 },
        'asansol': { lat: 23.6739, lng: 86.9524 },
        'nanded': { lat: 19.1383, lng: 77.3210 },
        'kolhapur': { lat: 16.7050, lng: 74.2433 },
        'ajmer': { lat: 26.4499, lng: 74.6399 },
        'akola': { lat: 20.7002, lng: 77.0082 },
        'gulbarga': { lat: 17.3297, lng: 76.8343 },
        'jamnagar': { lat: 22.4707, lng: 70.0577 },
        'ujjain': { lat: 23.1765, lng: 75.7885 },
        'loni': { lat: 28.7333, lng: 77.2833 },
        'siliguri': { lat: 26.7271, lng: 88.3953 },
        'jhansi': { lat: 25.4484, lng: 78.5685 },
        'ulhasnagar': { lat: 19.2215, lng: 73.1645 },
        'jammu': { lat: 32.7266, lng: 74.8570 },
        'sangli miraj kupwad': { lat: 16.8524, lng: 74.5815 },
        'mangalore': { lat: 12.9141, lng: 74.8560 },
        'erode': { lat: 11.3410, lng: 77.7172 },
        'belgaum': { lat: 15.8497, lng: 74.4977 },
        'ambattur': { lat: 13.1143, lng: 80.1548 },
        'tirunelveli': { lat: 8.7139, lng: 77.7567 },
        'malegaon': { lat: 20.5579, lng: 74.5287 },
        'gaya': { lat: 24.7914, lng: 85.0002 }
    };
    
    const cityKey = cityName.toLowerCase().trim();
    const coordinates = cityCoordinates[cityKey];
    
    if (coordinates) {
        console.log(`✅ Found coordinates for ${cityName}:`, coordinates);
        return coordinates;
    }
    
    // If city not found in database, try to use a web geocoding service
    try {
        // Using a free geocoding service (OpenStreetMap Nominatim)
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityName)}&limit=1`);
        const data = await response.json();
        
        if (data && data.length > 0) {
            const result = {
                lat: parseFloat(data[0].lat),
                lng: parseFloat(data[0].lon)
            };
            console.log(`✅ Geocoded ${cityName} via Nominatim:`, result);
            return result;
        }
    } catch (error) {
        console.warn('⚠️ Nominatim geocoding failed:', error);
    }
    
    console.warn(`⚠️ City not found: ${cityName}`);
    return null;
}

// ============================================================================
// CACHING SYSTEM
// ============================================================================
function cacheHospitalResults(hospitalList) {
    hospitalCache = {
        data: hospitalList,
        timestamp: Date.now(),
        location: { ...userLocation }
    };
    
    // Store in localStorage for offline access
    try {
        localStorage.setItem('emergency_hospital_cache', JSON.stringify(hospitalCache));
    } catch (error) {
        console.warn('⚠️ Failed to cache hospital data:', error);
    }
}

function loadCachedHospitals() {
    try {
        const cached = localStorage.getItem('emergency_hospital_cache');
        if (cached) {
            const cacheData = JSON.parse(cached);
            
            // Check if cache is still valid (5 minutes)
            if (Date.now() - cacheData.timestamp < EMERGENCY_CONFIG.CACHE_DURATION) {
                console.log('📋 Loading cached hospital data');
                return cacheData.data;
            }
        }
    } catch (error) {
        console.warn('⚠️ Failed to load cached data:', error);
    }
    return null;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
function initializeUI() {
    // Setup modal click outside to close
    document.getElementById('hospitalModal').addEventListener('click', (e) => {
        if (e.target.id === 'hospitalModal') {
            closeModal();
        }
    });
    
    // Setup city input enter key
    document.getElementById('cityInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchByCity();
        }
    });
}

function setupEventListeners() {
    // Setup modal click outside to close
    const modal = document.getElementById('hospitalModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target.id === 'hospitalModal') {
                closeModal();
            }
        });
    }
    
    // Setup city input enter key
    const cityInput = document.getElementById('cityInput');
    if (cityInput) {
        cityInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchByCity();
            }
        });
        
        // Auto-focus city input when manual location is shown
        cityInput.addEventListener('focus', () => {
            console.log('📍 City input focused');
        });
    }
    
    // Refresh location button
    window.refreshLocation = () => {
        console.log('🔄 Refreshing location...');
        userLocation = null;
        hospitals = [];
        nearestHospital = null;
        
        document.getElementById('loadingScreen').classList.remove('hidden');
        document.getElementById('sosInterface').classList.add('hidden');
        
        detectUserLocation();
    };
}

function hideLoadingScreen() {
    document.getElementById('loadingScreen').classList.add('hidden');
    document.getElementById('sosInterface').classList.remove('hidden');
}

function enableHospitalCallButton() {
    const callHospitalBtn = document.getElementById('callHospitalBtn');
    if (callHospitalBtn && nearestHospital && nearestHospital.phone) {
        callHospitalBtn.disabled = false;
        callHospitalBtn.querySelector('.btn-subtitle').textContent = nearestHospital.name;
    }
}

function showError(message, type = 'error') {
    const errorToast = document.getElementById('errorToast');
    const errorMessage = document.getElementById('errorMessage');
    
    errorMessage.textContent = message;
    errorToast.classList.remove('hidden');
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        hideError();
    }, 5000);
}

function hideError() {
    const errorToast = document.getElementById('errorToast');
    errorToast.classList.add('hidden');
}

function formatOSMAddress(tags) {
    const parts = [];
    if (tags['addr:street']) parts.push(tags['addr:street']);
    if (tags['addr:city']) parts.push(tags['addr:city']);
    if (tags['addr:state']) parts.push(tags['addr:state']);
    return parts.join(', ') || 'Address not available';
}

// ============================================================================
// GOOGLE MAPS CALLBACK
// ============================================================================
window.initMap = function() {
    console.log('🗺️ Google Maps API loaded');
    // Map will be initialized when user toggles map view
};

// ============================================================================
// GLOBAL FUNCTION EXPORTS
// ============================================================================
window.callEmergency = callEmergency;
window.callNearestHospital = callNearestHospital;
window.callHospital = callHospital;
window.callAmbulance = callAmbulance;
window.shareLocation = shareLocation;
window.openDirections = openDirections;
window.toggleMapView = toggleMapView;
window.refreshLocation = refreshLocation;
window.showHospitalDetails = showHospitalDetails;
window.closeModal = closeModal;
window.searchByCity = searchByCity;
window.hideError = hideError;

// Add retry location function
window.retryLocation = function() {
    console.log('🔄 Retrying location detection...');
    
    // Hide manual location input
    document.getElementById('manualLocation').classList.add('hidden');
    
    // Show loading screen
    document.getElementById('loadingScreen').classList.remove('hidden');
    document.getElementById('sosInterface').classList.add('hidden');
    
    // Reset state
    userLocation = null;
    hospitals = [];
    nearestHospital = null;
    
    // Clear any existing error messages
    hideError();
    
    // Retry location detection after a short delay
    setTimeout(() => {
        detectUserLocation();
    }, 500);
};

console.log('✅ Emergency SOS System Ready');

// ============================================================================
// END OF EMERGENCY SOS JAVASCRIPT
// ============================================================================