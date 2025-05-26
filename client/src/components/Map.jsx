export default function Map() {
    const googleMapsLink =
        "https://www.google.com/maps/place/%D9%88%D8%B1%D8%B4%D8%A9+%D9%85%D9%8A%D8%B2%D8%A9+%D8%A7%D9%84%D8%AA%D8%AD%D9%83%D9%85+%D9%84%D8%B5%D9%8A%D8%A2%D9%86%D8%A9+%D8%A2%D9%84%D8%B3%D9%8A%D8%A2%D8%B1%D8%A7%D8%AA%E2%80%AD/@21.9138049,39.3105947,19.75z/data=!4m14!1m7!3m6!1s0x15c17548db5b3e81:0x4004fedf8e3d90ae!2z2YjYsdi02Kkg2YXZitiy2Kkg2KfZhNiq2K3Zg9mFINmE2LXZitii2YbYqSDYotmE2LPZitii2LHYp9iq!8m2!3d21.9136667!4d39.3106958!16s%2Fg%2F11x8gmyzhq!3m5!1s0x15c17548db5b3e81:0x4004fedf8e3d90ae!8m2!3d21.9136667!4d39.3106958!16s%2Fg%2F11x8gmyzhq?entry=ttu&g_ep=EgoyMDI1MDQyMC4wIKXMDSoASAFQAw%3D%3D";



    return (
        <div className="contact-map-section">
            <div className="contact-info">
                <h3>Contact Us</h3>
                <p><strong>Phone:</strong> +966 555 123 456</p>
                <p><strong>Email:</strong> info@salmanworkshop.com</p>
                <p><strong>Location:</strong> Jeddah, Saudi Arabia</p>
            </div>

            <div className="map-wrapper">
                <iframe
                    title="Salman Car Workshop Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3877.769661183597!2d39.3105947!3d21.9138049!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x15c17548db5b3e81%3A0x4004fedf8e3d90ae!2z2YjYsdi02Kkg2YXZitiy2Kkg2KfZhNiq2K3Zg9mFINmE2LXZitii2YbYqSDYotmE2LPZitii2LHYp9iq!5e0!3m2!1sen!2ssa!4v1680000000000!5m2!1sen!2ssa"
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
                <a
                    href={googleMapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="map-link-button"
                >
                    View Larger Map
                </a>
            </div>
        </div>
    );
}
