// src/Pages/Basket/Basket.js
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { clearBasket, removeFromBasket, updateBasketQuantity } from "../../JS/Action/basketAction";
import "./Basket.css";

const Basket = () => {
  const dispatch = useDispatch();
  const basket = useSelector((state) => state.basket.items);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    governorate: "",
    municipality: "",
    address: "",
    postalCode: ""
  });
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Tunisia Governorates and their Delegations
  const tunisiaData = {
    "Tunis": ["Tunis Médina", "Bab Bhar", "Bab Souika", "Omrane", "Omrane Supérieur", "Ettahrir", "Ezzouhour", "El Menzah", "Cité El Khadra", "Sidi Hassine", "Séjoumi", "El Ouardia", "El Kabaria", "Sidi El Béchir", "Djebel Jelloud", "La Marsa", "Le Bardo", "Le Kram", "La Goulette", "Carthage", "Sidi Bou Said"],
    "Ariana": ["Ariana Ville", "Ettadhamen", "Mnihla", "Kalâat el-Andalous", "Raoued", "Sidi Thabet", "La Soukra"],
    "Ben Arous": ["Ben Arous", "Mornag", "El Mourouj", "Hammam Lif", "Hammam Chott", "Bou Mhel el-Bassatine", "Ezzahra", "Radès", "Mégrine", "Mohamedia", "Fouchana", "Nouvelle Medina"],
    "Manouba": ["Manouba", "Den Den", "Douar Hicher", "Oued Ellil", "Mornaguia", "Borj El Amri", "El Battan", "Tebourba"],
    "Nabeul": ["Nabeul", "Dar Chaabane El Fehri", "Béni Khiar", "El Mida", "Hammam Ghezèze", "Grombalia", "Bou Argoub", "Hammamet", "Menzel Bouzelfa", "Korba", "El Haouaria", "Takelsa", "Soliman", "Menzel Temime", "Kelibia", "Béni Khalled"],
    "Zaghouan": ["Zaghouan", "Zriba", "Bir Mcherga", "El Fahs", "Nadhour", "Saouaf"],
    "Bizerte": ["Bizerte Nord", "Bizerte Sud", "Ras Jebel", "Menzel Bourguiba", "Tinja", "Ghar El Melh", "Mateur", "Ghezala", "Menzel Jemil", "Joumine", "Sejnane", "El Alia", "Utique", "Jarzouna"],
    "Béja": ["Béja Nord", "Béja Sud", "Amdoun", "Nefza", "Teboursouk", "Tibar", "Testour", "Goubellat", "Medjez el-Bab"],
    "Jendouba": ["Jendouba", "Jendouba Nord", "Bou Salem", "Tabarka", "Aïn Draham", "Fernana", "Balta-Bou Aouane", "Ghardimaou", "Oued Meliz"],
    "Kef": ["Le Kef", "Le Kef Ouest", "Nebeur", "Sakiet Sidi Youssef", "Tajerouine", "Kalaat Senan", "Kalâat Khasba", "Jerissa", "El Ksour", "Dahmani", "Sers"],
    "Siliana": ["Siliana Nord", "Siliana Sud", "Bou Arada", "Gaâfour", "El Aroussa", "El Krib", "Bargou", "Makthar", "Rouhia", "Kesra", "Sidi Bou Rouis"],
    "Kairouan": ["Kairouan Nord", "Kairouan Sud", "Echbika", "Sbikha", "Oueslatia", "Haffouz", "El Alâa", "Hajeb El Ayoun", "Nasrallah", "Cherarda", "Bouhajla"],
    "Kasserine": ["Kasserine Nord", "Kasserine Sud", "Ezzouhour", "Hassi El Frid", "Sbeitla", "Sbiba", "Djedeliane", "El Ayoun", "Thala", "Hidra", "Foussana", "Feriana", "Mejel Bel Abbès"],
    "Sidi Bouzid": ["Sidi Bouzid Ouest", "Sidi Bouzid Est", "Jilma", "Cebalet Ouled Asker", "Bir El Hafey", "Sidi Ali Ben Aoun", "Menzel Bouzaiane", "Meknassy", "Souk Jedid", "Mezzouna", "Regueb", "Ouled Haffouz"],
    "Sousse": ["Sousse Médina", "Sousse Riadh", "Sousse Jawhara", "Sousse Sidi Abdelhamid", "Hammam Sousse", "Akouda", "Kalâa Kebira", "Sidi Bou Ali", "Hergla", "Enfidha", "Bouficha", "Kondar", "Sidi El Hani", "M'saken", "Kalâa Seghira", "Messaadine"],
    "Monastir": ["Monastir", "Ouerdanine", "Sahline", "Zéramdine", "Beni Hassen", "Jemmal", "Bembla", "Moknine", "Bekalta", "Téboulba", "Ksar Hellal", "Ksibet el-Médiouni", "Sayada-Lamta-Bou Hajar"],
    "Mahdia": ["Mahdia", "Bou Merdes", "Ouled Chamekh", "Chorbane", "Hebira", "Essouassi", "El Jem", "Chebba", "Melloulèche", "Sidi Alouane", "Ksour Essef"],
    "Sfax": ["Sfax Ville", "Sfax Ouest", "Sakiet Ezzit", "Sakiet Eddaïer", "Sfax Sud", "Thyna", "Agareb", "Jebiniana", "El Amra", "El Hencha", "Menzel Chaker", "Ghraïba", "Bir Ali Ben Khalifa", "Skhira", "Mahares", "Kerkennah"],
    "Gafsa": ["Gafsa Nord", "Gafsa Sud", "Sidi Aïch", "El Ksar", "Oum El Araies", "Redeyef", "Métlaoui", "Mdhila", "El Guettar", "Belkhir", "Sned"],
    "Tozeur": ["Tozeur", "Degache", "Tameghza", "Nefta", "Hazoua"],
    "Kebili": ["Kébili Sud", "Kébili Nord", "Souk Lahad", "Douz Nord", "Douz Sud", "El Faouar"],
    "Gabès": ["Gabès Médina", "Gabès Ouest", "Gabès Sud", "Ghannouch", "El Hamma", "Matmata", "Nouvelle Matmata", "Mareth", "Menzel El Habib", "Métouia"],
    "Medenine": ["Médenine Nord", "Médenine Sud", "Beni Khedache", "Ben Gardane", "Zarzis", "Houmt Souk", "Midoun", "Ajim", "Sidi Makhlouf"],
    "Tataouine": ["Tataouine Nord", "Tataouine Sud", "Bir Lahmar", "Ghomrassen", "Dhehiba", "Remada", "Smâr"]
  };

  const tunisiaGovernorates = Object.keys(tunisiaData);
  const [availableDelegations, setAvailableDelegations] = useState([]);

  const calculatedTotal = basket.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // When governorate changes, update available delegations
    if (name === "governorate") {
      setAvailableDelegations(tunisiaData[value] || []);
      setForm({ ...form, governorate: value, municipality: "" }); // Reset municipality
    }
  };

  const handleRemove = (productId) => {
    dispatch(removeFromBasket(productId));
    toast.info("Item removed from basket", { autoClose: 1500 });
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    dispatch(updateBasketQuantity(productId, newQuantity));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (basket.length === 0) {
      toast.error("Basket is empty");
      setLoading(false);
      return;
    }

    // Combine location fields
    const fullLocation = `${form.address}, ${form.municipality}, ${form.governorate} ${form.postalCode}`.trim();

    try {
      await axios.post("/api/orders", {
        customerInfo: {
          name: form.name,
          phone: form.phone,
          location: fullLocation,
          governorate: form.governorate,
          municipality: form.municipality,
          address: form.address,
          postalCode: form.postalCode
        },
        items: basket,
        total: calculatedTotal,
      });
      dispatch(clearBasket());
      toast.success("Order placed successfully!", { autoClose: 2000 });
      setShowForm(false);
      setForm({ name: "", phone: "", governorate: "", municipality: "", address: "", postalCode: "" });
      setAvailableDelegations([]);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.errors?.[0]?.msg || "Order failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="basket-container">
      <h2 className="basket-title">🛒 Your Basket</h2>

      {basket.length === 0 ? (
        <p className="basket-empty">No items in your basket.</p>
      ) : (
        <ul className="basket-list">
          {basket.map((item) => (
            <li key={item.productId} className="basket-item">
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name}
                  className="basket-item-image"
                />
              )}
              <div className="basket-item-details">
                <span className="basket-item-name">
                  <strong>{item.name}</strong> {item.size ? `(${item.size})` : ""}
                </span>
                <span className="basket-item-price">${item.price.toFixed(2)}</span>
              </div>
              <div className="basket-item-controls">
                <div className="quantity-selector">
                  <button
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                  >
                    −
                  </button>
                  <span className="quantity-display">{item.quantity}</span>
                  <button
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <span className="basket-item-total">${(item.price * item.quantity).toFixed(2)}</span>
                <button
                  onClick={() => handleRemove(item.productId)}
                  className="basket-remove-button"
                >
                  ✕
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <h3 className="basket-total">Total: ${calculatedTotal.toFixed(2)}</h3>

      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          disabled={basket.length === 0}
          className="basket-place-order-button"
        >
          🧾 Place Order
        </button>
      ) : (
        <>
          <hr className="basket-divider" />
          <h3 className="basket-complete-title">🧾 Complete Your Order</h3>
          <form onSubmit={handleSubmit} className="basket-form">
            {/* Personal Information */}
            <div className="form-section">
              <h4 className="form-section-title">👤 Personal Information</h4>
              <input
                name="name"
                placeholder="Full Name *"
                value={form.name}
                onChange={handleChange}
                required
                className="basket-input"
              />
              <input
                name="phone"
                type="tel"
                placeholder="Phone Number (e.g., +216 XX XXX XXX) *"
                value={form.phone}
                onChange={handleChange}
                required
                className="basket-input"
              />
            </div>

            {/* Delivery Address */}
            <div className="form-section">
              <h4 className="form-section-title">📍 Delivery Address</h4>

              <select
                name="governorate"
                value={form.governorate}
                onChange={handleChange}
                required
                className="basket-select"
              >
                <option value="">Select Governorate *</option>
                {tunisiaGovernorates.map((gov) => (
                  <option key={gov} value={gov}>{gov}</option>
                ))}
              </select>

              <select
                name="municipality"
                value={form.municipality}
                onChange={handleChange}
                required
                className="basket-select"
                disabled={!form.governorate}
              >
                <option value="">
                  {form.governorate ? "Select Delegation *" : "Select Governorate first"}
                </option>
                {availableDelegations.map((delegation) => (
                  <option key={delegation} value={delegation}>{delegation}</option>
                ))}
              </select>

              <textarea
                name="address"
                placeholder="Street Address (House/Building number, Street name) *"
                value={form.address}
                onChange={handleChange}
                required
                rows="3"
                className="basket-textarea"
              />

              <input
                name="postalCode"
                placeholder="Postal Code (optional)"
                value={form.postalCode}
                onChange={handleChange}
                className="basket-input"
              />
            </div>

            <div className="basket-buttons">
              <button
                type="submit"
                disabled={loading}
                className="basket-confirm-button"
              >
                {loading ? "Placing Order..." : "✓ Confirm Order"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="basket-cancel-button"
              >
                Cancel
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default Basket;
