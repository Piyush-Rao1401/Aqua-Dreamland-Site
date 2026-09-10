export default function Home() {
  return (
    <div className="bg-blue-100 min-h-screen">
      {/* Navbar */}
      <nav className="flex justify-between p-4 bg-white shadow">
        <h1 className="text-xl font-bold">Aqua Dreamland</h1>
        <ul className="flex gap-6">
          <li>Home</li>
          <li>Aquariums</li>
          <li>Soft Toys</li>
          <li>Pots</li>
          <li>Resin Décor</li>
          <li>🛒</li>
        </ul>
      </nav>

      {/* Hero Section */}
      <section className="text-center py-20 bg-cover bg-center" style={{backgroundImage: "url('/betta-fish.jpg')"}}>
        <h2 className="text-4xl font-bold text-white">Everything for your tank and everything around it.</h2>
        <div className="mt-6 flex justify-center gap-4">
          <button className="bg-blue-500 text-white px-6 py-2 rounded">Shop Aquariums</button>
          <button className="bg-gray-200 px-6 py-2 rounded">Browse All Products</button>
        </div>
      </section>

      {/* Categories */}
      <section className="grid grid-cols-4 gap-6 p-10">
        <div className="bg-white p-6 shadow">Aquariums</div>
        <div className="bg-white p-6 shadow">Soft Toys</div>
        <div className="bg-white p-6 shadow">Pots</div>
        <div className="bg-white p-6 shadow">Resin</div>
      </section>

      {/* Features */}
      <footer className="bg-blue-200 p-6 text-center">
        <p>1–3 ft aquarium sizes • ₹500+ starting tanks • Handpicked décor</p>
      </footer>
    </div>
  );
}
