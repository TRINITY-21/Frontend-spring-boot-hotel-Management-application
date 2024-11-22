import { Link } from "react-router-dom";

const FooterComponent = () => {


    return (
        

        <div className="bg-gray-100">
          {/* ADDITIONAL INFORMATION SECTION */}
      <section className="mt-10 mb-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center text-[#f70767] text-2xl font-bold mb-4 ">Why Choose Us?</div>
        <div className="flex flex-col md:flex-row justify-around px-4">
          <div className="bg-white shadow-lg rounded-lg p-4 m-2 text-center">
            <h3 className="font-semibold text-[#f70767] text-lg">Premium Amenities</h3>
            <p>Enjoy top-notch facilities including pools, spas, and fine dining.</p>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-4 m-2 text-center">
            <h3 className="font-semibold text-[#f70767] text-lg">Exceptional Service</h3>
            <p>Our staff is dedicated to providing you with an unforgettable experience.</p>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-4 m-2 text-center">
            <h3 className="font-semibold text-[#f70767] text-lg">Prime Location</h3>
            <p>Located in the heart of the city, close to attractions and nightlife.</p>
          </div>
        </div>
      </section>
           <footer 
      className=
        "w-full h-auto bg-[#f70767] py-3 px-4 lg:px-20 text-white"
    >
      <div className="flex flex-col sm:flex-row justify-between gap-2 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8text-white py-5 px-1">
        <p className="font-normal text-sm text-white">Copyright &#64; 2024 Fluffy Giggle, Inc.</p>

        <div className="flex items-center text-white justify-between w-full sm:w-fit gap-4 text-sm sm:text-base font-semibold "> 
          <Link href={""}>
            Terms &amp; Conditions
          </Link>
          <Link href="" >
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
        </div>
    )
};

export default FooterComponent;
