import React, { useState, useEffect } from "react";
import axios from "axios";
import Kiler from "./components/kilermenu";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import LoginPage from "./components/LoginPage";
import ProfilePage from "./components/ProfilePage";
import AddCocktail from "./components/addCocktail";
import Cocktail from "./components/cocktail";
import AvailableCocktails from "./components/availablecocktails";
import LoginRequired from "./components/LoginRequired"; // LoginRequired bileşeni

function App() {
  const [malzemeler, setMalzemeler] = useState([]);
  const [cocktails, setCocktails] = useState([]);
  const [availablecocktails, setavailableCocktails] = useState([]);
  const [currentPage, setCurrentPage] = useState("login");
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [ingredientsResponse, cocktailsResponse, profileResponse, availableCocktailsResponse] =
          await Promise.all([
            axios.get("http://localhost:8080/api/ingredient/getallingredients"),
            axios.get("http://localhost:8080/api/cocktail/getallcocktails"),
            axios.get("http://localhost:8080/api/auth/profile", {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
              },
            }),
            axios.get("http://localhost:8080/api/auth/getAvailableCocktails", {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
              },
            }),
          ]);

        if (ingredientsResponse.data.success) {
          setMalzemeler(ingredientsResponse.data.data);
        }

        if (cocktailsResponse.data.success) {
          setCocktails(cocktailsResponse.data.data);
        }

        if (profileResponse.data.data) {
          setSelectedItems(profileResponse.data.data.ingredients || []);
        }

        if (availableCocktailsResponse.data.success) {
          setavailableCocktails(availableCocktailsResponse.data.data);
        }

        setError(null);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Veri çekilirken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Update profile ingredients
  const updateProfileIngredients = async (updatedIngredients) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token bulunamadı.");

      await axios.put(
        "http://localhost:8080/api/auth/updateprofile",
        { ingredients: updatedIngredients },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("Profil güncellenirken hata:", error.message);
    }
  };

  // Update selected items
  const updateSelectedItems = (updatedItem) => {
    setSelectedItems((prevSelected) => {
      const newSelectedItems = prevSelected.includes(updatedItem)
        ? prevSelected.filter((item) => item !== updatedItem) // Varsa çıkar
        : [...prevSelected, updatedItem]; // Yoksa ekle

      updateProfileIngredients(newSelectedItems);
      return newSelectedItems;
    });
  };

  // Group ingredients by category
  const groupedMalzemeler = malzemeler.reduce((acc, malzeme) => {
    const { category, name } = malzeme;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(name);
    return acc;
  }, {});

  const customOrder = ["alkol", "soft", "sebze", "meyve", "sos", "şurup", "baharat", "diğer"];
  const categories = Object.keys(groupedMalzemeler).sort(
    (a, b) => customOrder.indexOf(a) - customOrder.indexOf(b)
  );

  // Handle page change via hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      const validPages = ["profile", "home", "login", "kiler", "available"];
      setCurrentPage(validPages.includes(hash) ? hash : "login");
    };
    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  const renderPage = () => {
    if (currentPage === "login") {
      return <>
        <Navbar />
        <LoginPage setCurrentPage={setCurrentPage} />
        <Footer />

      </>;
    } else if (currentPage === "kiler") {
      return (
        <>
          <Navbar />
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <LoginRequired message={error} />
          ) : (
            categories.map((category, index) => (
              <Kiler
                key={index}
                category={category}
                malzemelist={groupedMalzemeler[category]}
                selectedItems={selectedItems}
                updateSelectedItems={updateSelectedItems}
              />
            ))
          )}
          <Footer />
        </>
      );
    } else if (currentPage === "home") {
      return (
        <>
          <Navbar />
          <div className="cocktail-list">
            {loading ? (
              <div>Loading...</div>
            ) : error ? (
              <LoginRequired message={error} />
            ) : (
              cocktails.map((cocktail, index) => (
                <Cocktail key={index} cocktail={cocktail} />
              ))
            )}
          </div>

          <Footer />
        </>
      );
    } else if (currentPage === "profile") {
      return (
        <>
          <Navbar />
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <LoginRequired message={error} />
          ) : (
            <ProfilePage />
          )}
          <Footer />
        </>
      );
    }
    else if (currentPage === "available") {
      return (
        <>
          <Navbar />
          <h1 style={{ textAlign: "center" }}>Hazırlanabilir Kokteyller</h1>
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <LoginRequired message={error} />
          ) : !availablecocktails.length ? (
            <LoginRequired message="Hazırlanabilir kokteyller listesi boş." />
          ) : (
            <AvailableCocktails availablecocktails={availablecocktails} />
          )}
          <Footer />
        </>
      );
    }
  };
  return (
    <div className="App">

      {renderPage()}
    </div>
  );
}

export default App;
