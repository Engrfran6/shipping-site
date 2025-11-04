const Stats = () => {
  return (
    <section className="py-16 px-4 bg-blue-600 text-white">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold mb-2">10K+</div>
            <div className="text-blue-100">Happy Customers</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">1M+</div>
            <div className="text-blue-100">Packages Delivered</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">99.9%</div>
            <div className="text-blue-100">On-Time Delivery</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">24/7</div>
            <div className="text-blue-100">Customer Support</div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Stats;
