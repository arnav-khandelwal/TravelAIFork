import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import './Home.css';
import TopDestinations from './TopDestinations';
import logo from '../assets/logo2.png';
import backkkgg from '../assets/backkkgg.webp';
import { Link } from "react-router-dom";

const Home = () => {

const navigate = useNavigate();

  const handlePlanItineraryClick = async () => {
      const from = document.querySelector('[name="from"]').value;
      const destination = document.querySelector('[name="to"]').value;
      const startDate = document.querySelector('[name="departure"]').value;
      const endDate = document.querySelector('[name="returning"]').value || "N/A";  // Default to "N/A" if empty or undefined
      if (!(from && to && departure && returning)) {
        alert("Please fill in all required fields.");
        return;
      }
      try {
          const response = await fetch("http://localhost:5000/get_gemini_response", { 
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ 
              prompt: `Plan an itinerary for ${destination}, departing from ${from}. 
                      Travel dates: ${startDate} to ${endDate}. 
                      Include:
                      - Flight options
                      - Weather forecast
                      - Hotel recommendations
                      - Restaurant suggestions

                      Format the response as a JSON object with the following keys:  
                        - 'title' for the trip name.  
                        - 'days' as an array of day-wise activities. Each day should have 'day' and 'activities' keys. 
                        activities key should be an array of activites  including the 'time', 'activity' and 'details'
                        - 'hotels' as an array of hotels for the trip, with 'name', 'checkin', 'checkout', and 'details' for each hotel.  
                        - 'flights' as an array of flights with 'departure', 'arrival', 'airline', 'flightNumber', and 'details'.  

                      ` 
            }),
          });
        

          // Log the response to debug
          console.log("Response status:", response.status);
          const responseData = await response.json();
          console.log("Response body:", responseData);

          if (!response.ok) {
              throw new Error("Failed to fetch itinerary");
          }

          const itineraryData = responseData.response; // Assuming 'response' contains the itinerary
          console.log("Itinerary Data:", itineraryData);

          // Navigate with the itinerary data
          navigate("/itinerary", { state: { itinerary: itineraryData } });

      } catch (error) {
          console.error("Error planning itinerary:", error);
          alert("Failed to generate itinerary. Please try again.");
      }
  };    }
  
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    departure: '',
    return: '',
    travelPartner: '',
    purposeOfVisit: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const datePattern = /^\d{2}-\d{2}-\d{4}$/;
    if (name === "departure" || name === "return") {
      if (value === "" || datePattern.test(value)) {
        // Update formData only if the format is valid or the field is cleared
        setFormData({ ...formData, [name]: value });
      }
    } else {
      setFormData({ ...formData, [name]: value });
  };

  const handleSwap = () => {
    setFormData(prevState => ({
      from: prevState.to, 
      to: prevState.from,
      departure: prevState.departure,
      return: prevState.return,
      travelPartner: prevState.travelPartner,
      purposeOfVisit: prevState.purposeOfVisit
    }));
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  return (
    <>
      <header className="navbar">
        <div className="logo">
          <img src={logo} alt="Travel AI Logo" />
          <h1>Travel AI</h1>
        </div>
        <nav>
          <ul>
            <li><a href="#features">Features</a></li>
            <li><Link to="/login">Login</Link></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
      </header>

      <main>
        <section 
          style={{
            backgroundImage: `url(${backkkgg})`,
            backgroundSize: "cover", // Ensures the image covers the entire area
            backgroundRepeat: "no-repeat", // Prevents the image from repeating
          }}
        >
          <section className="hero">
            <h2>Plan Your Journey</h2>
            <p><b>Create a personalized travel itinerary for any location around the world!</b></p>
          </section>
          
          <div className="flight-search-container">
            <div className="trip-type">
              <label><input type="radio" name="trip" defaultChecked /> <span>One-way</span></label>
              <label><input type="radio" name="trip" /> <span>Round-trip</span></label>
              <label><input type="radio" name="trip" /> <span>Multi-city</span></label>
            </div>

            <div className="search-fields">
            <div className="field">
             <label>From</label>
            <input
          type="text"
          name="from"
          placeholder="Enter city or airport"
          value={formData.from}
          onChange={handleInputChange}
        />
      </div>
      <span className="swap-btn" onClick={handleSwap}>
        ⇄
      </span>
      <div className="field">
        <label>To</label>
        <input
          type="text"
          name="to"
          placeholder="Enter city or airport"
          value={formData.to}
          onChange={handleInputChange}
        />
      </div>
    
              <div className="field">
                <label>Departure</label>
                <input type="date" name="departure" value={formData.departure}  placeholder="dd-mm-yyyy"
                  min={new Date().toISOString().split("T")[0]}   onChange={handleInputChange} />
              </div>
              <div className="field">
                <label>Return</label>
                <input type="date" name="return" placeholder="dd-mm-yyyy" value={formData.return}  
                 min={formData.departure || new Date().toISOString().split("T")[0]}   onChange={handleInputChange} />
              </div>
              <div className="field">
                <label>Trip Buddy</label>
                <select name="travelPartner" value={formData.travelPartner} onChange={handleInputChange}>
                  <option value="">Select</option>
                  <option value="Solo">Solo</option>
                  <option value="Couple">Couple</option>
                  <option value="Family">Family</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="field">
                <label>Purpose of Visit</label>
                <select name="purposeOfVisit" value={formData.purposeOfVisit} onChange={handleInputChange}>
                  <option value="">Select</option>
                  <option value="Economy">Economy</option>
                  <option value="Premium Economy">Premium Economy</option>
                  <option value="Business">Business</option>
                  <option value="First Class">First Class</option>
                </select>
              </div>
            </div>

            <div className="special-fares">
              <div className="fare-option">
                <input type="checkbox" id="student" />
                <label htmlFor="student">👩‍🎓 Student<br /><span>Extra Baggage</span></label>
              </div>
              <div className="fare-option">
                <input type="checkbox" id="senior" />
                <label htmlFor="senior">👴 Senior Citizen<br /><span>Exclusive Discounts</span></label>
              </div>
              <div className="fare-option">
                <input type="checkbox" id="armed-forces" />
                <label htmlFor="armed-forces">🪖 Armed Forces<br /><span>Exclusive Discounts</span></label>
              </div>
              <div className="fare-option">
                <input type="checkbox" id="doctors" />
                <label htmlFor="doctors">👨‍⚕️ Doctors & Nurses<br /><span>Exclusive Discounts</span></label>
              </div>
            </div>

            <div className="search-btn">
              <button onClick={handlePlanItineraryClick}>Plan Itinerary</button>
            </div>
          </div>

          <section id="features" className="features">
            <div className="container">
              <h2 className="section-title">Explore Our Features</h2>
              <div className="features-grid">
                <div className="feature-item">
                  <div className="feature-icon">
                    <i className="fas fa-route"></i>
                  </div>
                  <h3>Smart Itinerary Generator</h3>
                  <p>Our AI-powered tool crafts personalized travel plans tailored to your preferences and schedule.</p>
                  <a href="#" className="feature-link">Learn More</a>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">
                    <i className="fas fa-globe-americas"></i>
                  </div>
                  <h3>Worldwide Coverage</h3>
                  <p>Discover hidden gems and popular destinations across every continent with local insights.</p>
                  <a href="#" className="feature-link">Explore Destinations</a>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">
                    <i className="fas fa-laptop"></i>
                  </div>
                  <h3>User-Friendly Interface</h3>
                  <p>Experience seamless trip planning with our intuitive and responsive design.</p>
                  <a href="#" className="feature-link">Try Now</a>
                </div>
              </div>
            </div>
          </section>
        </section>

        <TopDestinations />
        <div className="sections-container">
          <section id="how-it-works" className="how-it-works">
            <div className="container">
              <h2>How It Works</h2>
              <ol>
                <li>
                  <span className="step-number">1</span>
                  <p>Enter your desired travel destination.</p>
                </li>
                <li>
                  <span className="step-number">2</span>
                  <p>Click on <strong>"Generate Itinerary."</strong></p>
                </li>
                <li>
                  <span className="step-number">3</span>
                  <p>Receive a complete day-by-day travel plan tailored to your preferences.</p>
                </li>
              </ol>
            </div>
          </section>

          <section id="testimonials" className="testimonials">
            <h2>What Our Users Say</h2>
            <div className="testimonial">
              <p>"TravelPlanner made my trip to Bangkok unforgettable. Highly recommend! "</p>
              <span>- Arnav K.</span>
            </div>
            <div className="testimonial">
              <p>"The AI-generated itineraries saved me hours of research. A must-have for travelers!"</p>
              <span>- Mark T.</span>
            </div>
          </section>
        </div>
      </main>

      <footer className="footer" id="contact">
        <div className="footer-container">
          <div className="footer-left">
            <h2>Contact Us</h2>
            <form className="contact-form">
              <input type="text" placeholder="Your Name" />
              <input type="email" placeholder="Your Email" />
              <textarea placeholder="Your Message"></textarea>
              <button type="submit">Send Message</button>
            </form>
          </div>

          <div className="footer-middle">
            <img src={logo} alt="Travel AI Logo" className="footer-logo" />
            <div className="social-links">
              <a href="https://facebook.com/travelai" className="social-icon" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://twitter.com/travelai" className="social-icon" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://instagram.com/travelai" className="social-icon" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://linkedin.com/company/travelai" className="social-icon" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>

            <div className="contact-info">
              <p><i className="fas fa-envelope"></i> support@travelai.com</p>
              <p><i className="fas fa-envelope"></i> careers@travelai.com</p>
              <p><i className="fas fa-map-marker-alt"></i> Head Office: Jaypee Institute of Information Technology,<br />Sector 62, Noida, 201309</p>
              <p><i className="fas fa-phone"></i> +91 120-2400973</p>
              <p><i className="fas fa-clock"></i> Mon - Sat: 9:00 AM - 6:00 PM</p>
            </div>
          </div>

          <div className="footer-right">
            <h2>Subscribe to Newsletter</h2>
            <form className="newsletter-form">
              <input type="email" placeholder="Enter your email address" />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2024 TravelPlanner. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
};

export default Home