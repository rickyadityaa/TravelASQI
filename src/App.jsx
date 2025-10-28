import { useState } from 'react'
import './App.css'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [activeTab, setActiveTab] = useState('beranda')
  const [searchValue, setSearchValue] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [selectedService, setSelectedService] = useState(null)
  const [serviceType, setServiceType] = useState('')
  const [fromLocation, setFromLocation] = useState('')
  const [toLocation, setToLocation] = useState('')
  const [selectedVehicle, setSelectedVehicle] = useState('')
  const [rentalDays, setRentalDays] = useState(1)
  const [pickupLocation, setPickupLocation] = useState('')
  const [selectedTerminal, setSelectedTerminal] = useState('')

  // Data terminal Indonesia lengkap
  const terminals = [
    { id: 'terminal-pulogadung', name: 'Terminal Pulogadung', city: 'Jakarta', region: 'Jakarta Timur' },
    { id: 'terminal-kampung-rambutan', name: 'Terminal Kampung Rambutan', city: 'Jakarta', region: 'Jakarta Timur' },
    { id: 'terminal-lebak-bulus', name: 'Terminal Lebak Bulus', city: 'Jakarta', region: 'Jakarta Selatan' },
    { id: 'terminal-kalideres', name: 'Terminal Kalideres', city: 'Jakarta', region: 'Jakarta Barat' },
    { id: 'terminal-pasar-senen', name: 'Terminal Pasar Senen', city: 'Jakarta', region: 'Jakarta Pusat' },
    { id: 'terminal-bandung', name: 'Terminal Leuwipanjang', city: 'Bandung', region: 'Jawa Barat' },
    { id: 'terminal-surabaya', name: 'Terminal Purabaya', city: 'Surabaya', region: 'Jawa Timur' },
    { id: 'terminal-yogyakarta', name: 'Terminal Giwangan', city: 'Yogyakarta', region: 'DIY Yogyakarta' },
    { id: 'terminal-semarang', name: 'Terminal Terboyo', city: 'Semarang', region: 'Jawa Tengah' },
    { id: 'terminal-malang', name: 'Terminal Arjosari', city: 'Malang', region: 'Jawa Timur' },
    { id: 'terminal-medan', name: 'Terminal Amplas', city: 'Medan', region: 'Sumatra Utara' },
    { id: 'terminal-palembang', name: 'Terminal Alang-Alang Lebar', city: 'Palembang', region: 'Sumatra Selatan' },
    { id: 'terminal-makassar', name: 'Terminal Mallengkeri', city: 'Makassar', region: 'Sulawesi Selatan' },
    { id: 'terminal-denpasar', name: 'Terminal Ubung', city: 'Denpasar', region: 'Bali' },
    { id: 'terminal-manado', name: 'Terminal Malalayang', city: 'Manado', region: 'Sulawesi Utara' }
  ]

  // Data kota dan harga realistik
  const cities = [
    { name: 'Jakarta', basePrice: 50000 },
    { name: 'Bandung', basePrice: 60000 },
    { name: 'Surabaya', basePrice: 120000 },
    { name: 'Medan', basePrice: 150000 },
    { name: 'Semarang', basePrice: 80000 },
    { name: 'Yogyakarta', basePrice: 70000 },
    { name: 'Bali', basePrice: 200000 },
    { name: 'Makassar', basePrice: 180000 },
    { name: 'Palembang', basePrice: 130000 },
    { name: 'Malang', basePrice: 90000 },
    { name: 'Bogor', basePrice: 55000 },
    { name: 'Tangerang', basePrice: 45000 }
  ]

  // Data armada dan harga
  const vehicles = [
    { id: 'bus-besar', name: 'Bus Besar (40-50 Seat)', basePrice: 2500000, image: '🚌' },
    { id: 'bus-sedang', name: 'Bus Sedang (25-30 Seat)', basePrice: 1800000, image: '🚍' },
    { id: 'bus-kecil', name: 'Bus Kecil (15-20 Seat)', basePrice: 1200000, image: '🚎' },
    { id: 'elf', name: 'Elf (10-12 Seat)', basePrice: 800000, image: '🚐' },
    { id: 'hiace', name: 'Hiace (6-8 Seat)', basePrice: 600000, image: '🚙' }
  ]

  // Data bandara Indonesia
  const airports = [
    { code: 'CGK', name: 'Bandara Soekarno-Hatta', city: 'Jakarta' },
    { code: 'SUB', name: 'Bandara Juanda', city: 'Surabaya' },
    { code: 'DPS', name: 'Bandara Ngurah Rai', city: 'Denpasar' },
    { code: 'JOG', name: 'Bandara Adisutjipto', city: 'Yogyakarta' },
    { code: 'BDO', name: 'Bandara Husein Sastranegara', city: 'Bandung' },
    { code: 'MDC', name: 'Bandara Sam Ratulangi', city: 'Manado' },
    { code: 'UPG', name: 'Bandara Sultan Hasanuddin', city: 'Makassar' },
    { code: 'KNO', name: 'Bandara Kualanamu', city: 'Medan' }
  ]

  // Fungsi untuk handle service click
  const handleServiceClick = (service, type = '') => {
    setSelectedService(service)
    setServiceType(type)
  }

  // Kalkulasi harga berdasarkan jarak dan jenis layanan
  const calculatePrice = (from, to, serviceType, vehicleType = null) => {
    const fromCity = cities.find(city => city.name === from)
    const toCity = cities.find(city => city.name === to)
    
    if (!fromCity || !toCity) return 0
    
    const basePrice = Math.abs(fromCity.basePrice - toCity.basePrice) * 1.5
    
    switch (serviceType) {
      case 'shuttle':
        return Math.max(50000, basePrice)
      case 'airport-shuttle':
        return Math.max(75000, basePrice * 1.2)
      case 'kirim-paket':
        return Math.max(30000, basePrice * 0.8)
      case 'sewa-armada':
        const vehicle = vehicles.find(v => v.id === vehicleType)
        return vehicle ? vehicle.basePrice + (basePrice * 2) : 0
      default:
        return basePrice
    }
  }

  const renderShuttleBooking = () => (
    <div className="shuttle-booking">
      <div className="booking-header">
        <button className="back-btn" onClick={() => setSelectedService(null)}>
          ← Kembali
        </button>
        <h3>Pesan Shuttle</h3>
      </div>
      
      <div className="location-inputs">
        <div className="input-group">
          <label>Dari</label>
          <select 
            value={fromLocation} 
            onChange={(e) => setFromLocation(e.target.value)}
            className="location-select"
          >
            <option value="">Pilih Kota Asal</option>
            {cities.map(city => (
              <option key={city.name} value={city.name}>{city.name}</option>
            ))}
          </select>
        </div>
        
        <div className="input-group">
          <label>Ke</label>
          <select 
            value={toLocation} 
            onChange={(e) => setToLocation(e.target.value)}
            className="location-select"
          >
            <option value="">Pilih Kota Tujuan</option>
            {cities.map(city => (
              <option key={city.name} value={city.name}>{city.name}</option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <label>Terminal Keberangkatan</label>
          <select 
            value={selectedTerminal} 
            onChange={(e) => setSelectedTerminal(e.target.value)}
            className="location-select"
          >
            <option value="">Pilih Terminal</option>
            {terminals.map(terminal => (
              <option key={terminal.id} value={terminal.id}>{terminal.name} - {terminal.city}</option>
            ))}
          </select>
        </div>
      </div>

      {fromLocation && toLocation && (
        <>
          <div className="map-container">
            <div className="map-placeholder">
              <div className="map-icon">🗺️</div>
              <h4>Peta Rute Perjalanan</h4>
              <p>{fromLocation} → {toLocation}</p>
              <div className="route-info">
                <div className="route-detail">
                  <span>🕒 Estimasi Waktu:</span>
                  <span>6-8 Jam</span>
                </div>
                <div className="route-detail">
                  <span>💰 Harga:</span>
                  <span>Rp {calculatePrice(fromLocation, toLocation, 'shuttle').toLocaleString()}</span>
                </div>
                <div className="route-detail">
                  <span>📍 Terminal:</span>
                  <span>{selectedTerminal ? terminals.find(t => t.id === selectedTerminal)?.name : 'Pilih Terminal'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="price-calculation">
            <div className="price-breakdown">
              <h4>Detail Biaya</h4>
              <div className="price-item">
                <span>Tarif Dasar:</span>
                <span>Rp {calculatePrice(fromLocation, toLocation, 'shuttle').toLocaleString()}</span>
              </div>
              <div className="price-item">
                <span>Layanan Shuttle:</span>
                <span>Rp 15.000</span>
              </div>
              <div className="price-total">
                <span>Total:</span>
                <span>Rp {(calculatePrice(fromLocation, toLocation, 'shuttle') + 15000).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </>
      )}

      <button className="book-now-btn">
        Pesan Sekarang - Rp {fromLocation && toLocation ? 
          (calculatePrice(fromLocation, toLocation, 'shuttle') + 15000).toLocaleString() : 
          '0'}
      </button>
    </div>
  )

  const renderAirportShuttle = () => (
    <div className="service-booking">
      <div className="booking-header">
        <button className="back-btn" onClick={() => setSelectedService(null)}>
          ← Kembali
        </button>
        <h3>Airport Shuttle</h3>
      </div>
      
      <div className="service-specific-content">
        <h4>Layanan Antar Jemput Bandara</h4>
        
        <div className="location-inputs">
          <div className="input-group">
            <label>Bandara</label>
            <select className="location-select">
              <option value="">Pilih Bandara</option>
              {airports.map(airport => (
                <option key={airport.code} value={airport.code}>
                  {airport.name} ({airport.code}) - {airport.city}
                </option>
              ))}
            </select>
          </div>
          
          <div className="input-group">
            <label>Tujuan</label>
            <select className="location-select">
              <option value="">Pilih Tujuan</option>
              {cities.map(city => (
                <option key={city.name} value={city.name}>{city.name}</option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label>Jumlah Penumpang</label>
            <input 
              type="number" 
              min="1" 
              max="10" 
              defaultValue="1"
              className="rental-days"
            />
          </div>
        </div>

        <div className="price-calculation">
          <div className="price-breakdown">
            <h4>Estimasi Biaya</h4>
            <div className="price-item">
              <span>Tarif Bandara:</span>
              <span>Rp 100.000</span>
            </div>
            <div className="price-item">
              <span>Biaya Tol & Parkir:</span>
              <span>Rp 25.000</span>
            </div>
            <div className="price-total">
              <span>Total:</span>
              <span>Rp 125.000</span>
            </div>
          </div>
        </div>

        <button className="book-now-btn">
          Pesan Airport Shuttle - Rp 125.000
        </button>
      </div>
    </div>
  )

  const renderKirimPaket = () => (
    <div className="service-booking">
      <div className="booking-header">
        <button className="back-btn" onClick={() => setSelectedService(null)}>
          ← Kembali
        </button>
        <h3>Kirim Paket</h3>
      </div>

      <div className="shipping-form">
        <div className="input-group">
          <label>Jenis Paket</label>
          <select className="location-select">
            <option value="">Pilih Jenis Paket</option>
            <option value="dokumen">Dokumen (max 1kg)</option>
            <option value="kecil">Paket Kecil (1-5kg)</option>
            <option value="sedang">Paket Sedang (5-10kg)</option>
            <option value="besar">Paket Besar (10-20kg)</option>
          </select>
        </div>

        <div className="input-group">
          <label>Alamat Pengambilan</label>
          <input type="text" placeholder="Alamat lengkap pengambilan paket" className="location-select" />
        </div>

        <div className="input-group">
          <label>Alamat Tujuan</label>
          <input type="text" placeholder="Alamat lengkap tujuan paket" className="location-select" />
        </div>

        <div className="input-group">
          <label>Keterangan Paket</label>
          <textarea placeholder="Deskripsi barang yang dikirim" className="location-select textarea" rows="3"></textarea>
        </div>

        <div className="price-calculation">
          <div className="price-breakdown">
            <h4>Estimasi Biaya</h4>
            <div className="price-item">
              <span>Tarif Dasar:</span>
              <span>Rp 25.000</span>
            </div>
            <div className="price-item">
              <span>Asuransi:</span>
              <span>Rp 5.000</span>
            </div>
            <div className="price-total">
              <span>Total:</span>
              <span>Rp 30.000</span>
            </div>
          </div>
        </div>

        <button className="book-now-btn">
          Pesan Kurir Sekarang - Rp 30.000
        </button>
      </div>
    </div>
  )

  const renderBusAKAP = () => (
    <div className="service-booking">
      <div className="booking-header">
        <button className="back-btn" onClick={() => setSelectedService(null)}>
          ← Kembali
        </button>
        <h3>Bus AKAP (Antar Kota Antar Provinsi)</h3>
      </div>

      <div className="akap-routes">
        <h4>Rute Populer</h4>
        <div className="route-grid">
          <div className="route-card">
            <h5>Jakarta - Bandung</h5>
            <p>💰 Rp 80.000 - 120.000</p>
            <p>🕒 3-4 jam</p>
            <p>📍 Terminal Pulogadung → Terminal Leuwipanjang</p>
            <button className="route-select-btn">Pilih Rute</button>
          </div>
          <div className="route-card">
            <h5>Jakarta - Yogyakarta</h5>
            <p>💰 Rp 150.000 - 250.000</p>
            <p>🕒 8-10 jam</p>
            <p>📍 Terminal Kampung Rambutan → Terminal Giwangan</p>
            <button className="route-select-btn">Pilih Rute</button>
          </div>
          <div className="route-card">
            <h5>Surabaya - Bali</h5>
            <p>💰 Rp 200.000 - 300.000</p>
            <p>🕒 10-12 jam</p>
            <p>📍 Terminal Purabaya → Terminal Ubung</p>
            <button className="route-select-btn">Pilih Rute</button>
          </div>
          <div className="route-card">
            <h5>Medan - Padang</h5>
            <p>💰 Rp 180.000 - 220.000</p>
            <p>🕒 12-14 jam</p>
            <p>📍 Terminal Amplas → Terminal Lintas Andalas</p>
            <button className="route-select-btn">Pilih Rute</button>
          </div>
        </div>
      </div>

      <div className="location-inputs">
        <div className="input-group">
          <label>Kota Asal</label>
          <select className="location-select">
            <option value="">Pilih Kota Asal</option>
            {cities.map(city => (
              <option key={city.name} value={city.name}>{city.name}</option>
            ))}
          </select>
        </div>
        
        <div className="input-group">
          <label>Kota Tujuan</label>
          <select className="location-select">
            <option value="">Pilih Kota Tujuan</option>
            {cities.map(city => (
              <option key={city.name} value={city.name}>{city.name}</option>
            ))}
          </select>
        </div>
      </div>

      <button className="book-now-btn">
        Cari Tiket Bus AKAP
      </button>
    </div>
  )

  const renderBusMalam = () => (
    <div className="service-booking">
      <div className="booking-header">
        <button className="back-btn" onClick={() => setSelectedService(null)}>
          ← Kembali
        </button>
        <h3>Bus Malam</h3>
      </div>

      <div className="service-specific-content">
        <h4>Layanan Bus Malam Nyaman</h4>
        <div className="feature-list">
          <div className="feature-item">
            <span className="feature-icon">😴</span>
            <div>
              <h5>Kursi Tidur</h5>
              <p>Kursi reclining yang nyaman untuk tidur selama perjalanan</p>
            </div>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🍱</span>
            <div>
              <h5>Makanan Ringan</h5>
              <p>Snack dan minuman gratis selama perjalanan</p>
            </div>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🛌</span>
            <div>
              <h5>Selimut</h5>
              <p>Selimut bersia untuk kenyamanan tidur Anda</p>
            </div>
          </div>
        </div>

        <div className="location-inputs">
          <div className="input-group">
            <label>Rute Bus Malam</label>
            <select className="location-select">
              <option value="">Pilih Rute</option>
              <option value="jakarta-surabaya">Jakarta - Surabaya</option>
              <option value="jakarta-yogyakarta">Jakarta - Yogyakarta</option>
              <option value="bandung-bali">Bandung - Bali</option>
              <option value="surabaya-medan">Surabaya - Medan</option>
            </select>
          </div>
          
          <div className="input-group">
            <label>Tanggal Keberangkatan</label>
            <input type="date" className="location-select" />
          </div>
        </div>

        <div className="price-calculation">
          <div className="price-breakdown">
            <h4>Harga Bus Malam</h4>
            <div className="price-item">
              <span>Tarif Tiket:</span>
              <span>Rp 200.000 - 350.000</span>
            </div>
            <div className="price-item">
              <span>Fasilitas Tambahan:</span>
              <span>Termasuk</span>
            </div>
          </div>
        </div>

        <button className="book-now-btn">
          Pesan Tiket Bus Malam
        </button>
      </div>
    </div>
  )

  const renderTransJawa = () => (
    <div className="service-booking">
      <div className="booking-header">
        <button className="back-btn" onClick={() => setSelectedService(null)}>
          ← Kembali
        </button>
        <h3>Trans Jawa</h3>
      </div>

      <div className="service-specific-content">
        <h4>Rute Lintas Jawa Terintegrasi</h4>
        
        <div className="route-map">
          <div className="route-line">
            <div className="route-stop">
              <span className="stop-icon">●</span>
              <span>Merak</span>
            </div>
            <div className="route-stop">
              <span className="stop-icon">●</span>
              <span>Jakarta</span>
            </div>
            <div className="route-stop">
              <span className="stop-icon">●</span>
              <span>Bandung</span>
            </div>
            <div className="route-stop">
              <span className="stop-icon">●</span>
              <span>Yogyakarta</span>
            </div>
            <div className="route-stop">
              <span className="stop-icon">●</span>
              <span>Surabaya</span>
            </div>
            <div className="route-stop">
              <span className="stop-icon">●</span>
              <span>Banyuwangi</span>
            </div>
          </div>
        </div>

        <div className="location-inputs">
          <div className="input-group">
            <label>Stasiun Keberangkatan</label>
            <select className="location-select">
              <option value="">Pilih Stasiun</option>
              <option value="merak">Terminal Merak</option>
              <option value="jakarta">Terminal Pulogadung</option>
              <option value="bandung">Terminal Leuwipanjang</option>
              <option value="yogyakarta">Terminal Giwangan</option>
              <option value="surabaya">Terminal Purabaya</option>
            </select>
          </div>
          
          <div className="input-group">
            <label>Stasiun Tujuan</label>
            <select className="location-select">
              <option value="">Pilih Stasiun</option>
              <option value="merak">Terminal Merak</option>
              <option value="jakarta">Terminal Pulogadung</option>
              <option value="bandung">Terminal Leuwipanjang</option>
              <option value="yogyakarta">Terminal Giwangan</option>
              <option value="surabaya">Terminal Purabaya</option>
            </select>
          </div>
        </div>

        <div className="price-calculation">
          <div className="price-breakdown">
            <h4>Tarif Trans Jawa</h4>
            <div className="price-item">
              <span>Ekonomi:</span>
              <span>Rp 50.000 - 150.000</span>
            </div>
            <div className="price-item">
              <span>Bisnis:</span>
              <span>Rp 100.000 - 250.000</span>
            </div>
            <div className="price-item">
              <span>Executive:</span>
              <span>Rp 150.000 - 350.000</span>
            </div>
          </div>
        </div>

        <button className="book-now-btn">
          Cari Tiket Trans Jawa
        </button>
      </div>
    </div>
  )

  const renderSewaArmada = () => {
    const selectedVehicleData = vehicles.find(v => v.id === selectedVehicle)
    const totalPrice = selectedVehicleData ? (selectedVehicleData.basePrice + 200000) * rentalDays : 0

    return (
      <div className="sewa-armada-booking">
        <div className="booking-header">
          <button className="back-btn" onClick={() => setSelectedService(null)}>
            ← Kembali
          </button>
          <h3>Sewa Armada</h3>
        </div>

        <div className="vehicle-selection">
          <h4>Pilih Jenis Armada</h4>
          <div className="vehicles-grid">
            {vehicles.map(vehicle => (
              <div 
                key={vehicle.id}
                className={`vehicle-card ${selectedVehicle === vehicle.id ? 'selected' : ''}`}
                onClick={() => setSelectedVehicle(vehicle.id)}
              >
                <div className="vehicle-icon">{vehicle.image}</div>
                <h5>{vehicle.name}</h5>
                <p>Rp {vehicle.basePrice.toLocaleString()}/hari</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rental-details">
          <div className="input-group">
            <label>Lama Sewa (hari)</label>
            <input 
              type="number" 
              min="1" 
              value={rentalDays}
              onChange={(e) => setRentalDays(parseInt(e.target.value) || 1)}
              className="rental-days" 
            />
          </div>
          
          <div className="input-group">
            <label>Lokasi Pengambilan</label>
            <select 
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              className="location-select"
            >
              <option value="">Pilih Lokasi</option>
              {cities.map(city => (
                <option key={city.name} value={city.name}>{city.name}</option>
              ))}
            </select>
          </div>
        </div>

        {selectedVehicle && (
          <div className="price-summary">
            <h4>Ringkasan Biaya</h4>
            <div className="price-item">
              <span>Sewa Armada ({rentalDays} hari):</span>
              <span>Rp {(selectedVehicleData.basePrice * rentalDays).toLocaleString()}</span>
            </div>
            <div className="price-item">
              <span>Layanan Driver:</span>
              <span>Rp {(200000 * rentalDays).toLocaleString()}</span>
            </div>
            <div className="price-total">
              <span>Total Estimasi:</span>
              <span>Rp {totalPrice.toLocaleString()}</span>
            </div>
          </div>
        )}

        <button className="book-now-btn">
          Sewa Sekarang - Rp {selectedVehicle ? totalPrice.toLocaleString() : '0'}
        </button>
      </div>
    )
  }

  const renderServiceContent = () => {
    switch(serviceType) {
      case 'airport-shuttle':
        return renderAirportShuttle()
      case 'kirim-paket':
        return renderKirimPaket()
      case 'bus-akap':
        return renderBusAKAP()
      case 'bus-malam':
        return renderBusMalam()
      case 'trans-jawa':
        return renderTransJawa()
      case 'sewa-armada':
        return renderSewaArmada()
      default:
        return renderShuttleBooking()
    }
  }

  const renderContent = () => {
    if (selectedService) {
      return renderServiceContent()
    }

    switch(activeTab) {
      case 'pesanan':
        return (
          <div className="tab-content">
            <h2>Pesanan Saya</h2>
            <p>Lihat dan kelola pesanan perjalanan Anda</p>
            <div className="order-list">
              <div className="order-item">Tidak ada pesanan aktif</div>
            </div>
          </div>
        )
      case 'asqicare':
        return (
          <div className="tab-content">
            <h2>ASQI Care</h2>
            <p>Layanan bantuan dan dukungan 24/7</p>
            <div className="care-options">
              <button className="care-btn">Hubungi Customer Service</button>
              <button className="care-btn">FAQ</button>
              <button className="care-btn">Bantuan Darurat</button>
            </div>
          </div>
        )
      case 'inbox':
        return (
          <div className="tab-content">
            <h2>Inbox</h2>
            <p>Pesan dan notifikasi terbaru</p>
            <div className="inbox-list">
              <div className="inbox-item">Tidak ada pesan baru</div>
            </div>
          </div>
        )
      case 'akun':
        return (
          <div className="tab-content">
            <h2>Akun Saya</h2>
            <div className="profile-card">
              <div className="profile-pic">👤</div>
              <h3>Guest User</h3>
              <p>Silakan login untuk mengakses fitur lengkap</p>
              <button className="btn-primary" onClick={() => setIsLoggedIn(!isLoggedIn)}>
                {isLoggedIn ? 'Logout' : 'Login'}
              </button>
            </div>
          </div>
        )
      default:
        return (
          <>
            {/* Hero Section */}
            <section className="hero">
              <div className="container">
                <h2>ASQI</h2>
                <p>Travel Terpercaya untuk Perjalanan Anda</p>
              </div>
            </section>

            {/* Promo Section */}
            <section className="promo-section">
              <div className="container">
                <div className="promo-card">
                  <div className="promo-header">
                    <h3>Bandung - Jakarta</h3>
                    <span className="duration-badge">6-8 JAM</span>
                  </div>
                  <p className="promo-subtitle">Terminal Leuwipanjang → Terminal Pulogadung</p>
                  <div className="promo-price">
                    <span className="price-label">Hanya</span>
                    <span className="price-amount">60.000RP</span>
                  </div>
                  <button className="btn-promo">Coba Sekarang</button>
                </div>
              </div>
            </section>

            {/* Services Section */}
            <section className="services">
              <div className="container">
                <h3 className="section-title">Layanan Kami</h3>
                <div className="services-grid">
                  {/* Shuttle Group */}
                  <div className="service-group">
                    <div className="service-main-card" onClick={() => handleServiceClick('shuttle', 'shuttle')}>
                      <div className="service-icon">🚐</div>
                      <h4>Shuttle</h4>
                      <span className="service-arrow">→</span>
                    </div>
                    <div className="service-sub-cards">
                      <div className="service-sub-card" onClick={() => handleServiceClick('shuttle', 'airport-shuttle')}>
                        <span className="sub-icon">✈️</span>
                        <div>
                          <h5>Airport Shuttle</h5>
                          <p>Layanan antar jemput bandara</p>
                        </div>
                        <span className="arrow">→</span>
                      </div>
                      <div className="service-sub-card" onClick={() => handleServiceClick('shuttle', 'kirim-paket')}>
                        <span className="sub-icon">📦</span>
                        <div>
                          <h5>Kirim Paket</h5>
                          <p>Pengiriman paket cepat</p>
                        </div>
                        <span className="arrow">→</span>
                      </div>
                    </div>
                  </div>

                  {/* Sewa Armada Group */}
                  <div className="service-group">
                    <div className="service-main-card" onClick={() => handleServiceClick('sewa-armada', 'sewa-armada')}>
                      <div className="service-icon">🚌</div>
                      <h4>Sewa Armada</h4>
                      <span className="service-arrow">→</span>
                    </div>
                    <div className="service-sub-cards">
                      <div className="service-sub-card" onClick={() => handleServiceClick('bus', 'bus-akap')}>
                        <span className="sub-icon">🛣️</span>
                        <div>
                          <h5>Bus AKAP</h5>
                          <p>Bus Antar Kota Antar Provinsi</p>
                        </div>
                        <span className="arrow">→</span>
                      </div>
                    </div>
                  </div>

                  {/* ASQA Group */}
                  <div className="service-group">
                    <div className="service-main-card">
                      <div className="service-icon">🌙</div>
                      <h4>ASQA</h4>
                    </div>
                    <div className="service-sub-cards">
                      <div className="service-sub-card" onClick={() => handleServiceClick('bus', 'bus-malam')}>
                        <span className="sub-icon">🌃</span>
                        <div>
                          <h5>Bus Malam</h5>
                          <p>Perjalanan malam hari</p>
                        </div>
                        <span className="arrow">→</span>
                      </div>
                      <div className="service-sub-card" onClick={() => handleServiceClick('bus', 'trans-jawa')}>
                        <span className="sub-icon">🗺️</span>
                        <div>
                          <h5>Trans Jawa</h5>
                          <p>Rute lintas Jawa</p>
                        </div>
                        <span className="arrow">→</span>
                      </div>
                      <div className="service-sub-card highlight">
                        <span className="sub-icon">⭐</span>
                        <div>
                          <h5>Promo Spesial</h5>
                          <p>Bisa di pesan sekorang!</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="cta">
              <div className="container">
                <h3>Siap Memulai Perjalanan?</h3>
                <p>Pesan sekarang dan dapatkan pengalaman travel terbaik</p>
                <button className="btn-order">Order Now</button>
              </div>
            </section>
          </>
        )
    }
  }

  return (
    <div className="app">
      {/* Header dengan Search di sebelah tombol auth */}
      <header className="header">
        <div className="container">
          <div className="header-content">
            <h1 className="logo">ASQI</h1>
            <div className="header-right">
              {/* Search Bar di Header */}
              <div className={`header-search ${isSearchFocused ? 'focused' : ''}`}>
                <input 
                  type="text" 
                  placeholder="Type here to search..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="search-input"
                />
                <button className="search-btn">🔍</button>
              </div>
              
              <div className="auth-buttons">
                {isLoggedIn ? (
                  <span className="welcome-text">Welcome User!</span>
                ) : (
                  <>
                    <button className="btn-secondary">Daftar Membership</button>
                    <button className="btn-primary">Daftar / Login</button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="container">
          {renderContent()}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <button 
          className={`nav-item ${activeTab === 'beranda' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('beranda')
            setSelectedService(null)
          }}
        >
          <span className="nav-icon">🏠</span>
          <span className="nav-label">Beranda</span>
        </button>
        
        <button 
          className={`nav-item ${activeTab === 'pesanan' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('pesanan')
            setSelectedService(null)
          }}
        >
          <span className="nav-icon">📦</span>
          <span className="nav-label">Pesanan</span>
        </button>
        
        <button 
          className={`nav-item ${activeTab === 'asqicare' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('asqicare')
            setSelectedService(null)
          }}
        >
          <span className="nav-icon">❤️</span>
          <span className="nav-label">ASQI Care</span>
        </button>
        
        <button 
          className={`nav-item ${activeTab === 'inbox' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('inbox')
            setSelectedService(null)
          }}
        >
          <span className="nav-icon">📨</span>
          <span className="nav-label">Inbox</span>
        </button>
        
        <button 
          className={`nav-item ${activeTab === 'akun' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('akun')
            setSelectedService(null)
          }}
        >
          <span className="nav-icon">👤</span>
          <span className="nav-label">Akun Saya</span>
        </button>
      </nav>

      {/* Mobile Notice */}
      <div className="mobile-notice">
        <p>📱 Untuk pengalaman terbaik, buka web ini di perangkat seluler.</p>
      </div>
    </div>
  )
}

export default App