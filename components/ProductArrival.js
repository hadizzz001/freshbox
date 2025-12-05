import { useState, useEffect } from 'react';
import CarCard from './CarCard';
import { useRouter } from "next/navigation";

const YourComponent = () => {
  const [allTemps, setAllTemps] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/products', { cache: 'no-store' });
      if (response.ok) {
        const data = await response.json();
        setAllTemps(data.slice(-8));   // <-- show latest 8 items
      } else {
        console.error('Failed to fetch categories');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  return (
    <div className="ProvidersIfSelectedProductMatchesFilter mt-4 px-4 sm:px-6 md:px-8">

      <content-block slug="product-page-wssb">
        <div className="ProductTile-SliderContainer ProductTile-SliderContainer--YMAL">

          {allTemps && allTemps.length > 0 ? (
            <>
              <h1 className="uppercase text-center my-6 px-4 myGrayCat1 mt-20 mb-10">
                BEST SELLERS
              </h1>

              {/* GRID OF 8 ITEMS */}
              <section className='mb-5 w-full'>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {allTemps.map((temp) => (
                    <CarCard key={temp._id} temp={temp} />
                  ))}
                </div>
              </section>

              <div className="text-center">
                <button 
                  className='myinsidebtn'
                  onClick={() => router.push("/shop")}
                >
                  Shop All
                </button>
              </div>
            </>
          ) : (
            <div className="home___error-container text-center">
              <h2 className="text-black text-xl font-bold">No products available</h2>
            </div>
          )}
        </div>
      </content-block>

    </div>
  );
};

export default YourComponent;
