"use client";
import { useState, useEffect } from "react";
import { User, Package, MapPin, LogOut, ShieldCheck, Lock, Mail } from "lucide-react";

export default function CustomerAccountPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  // États pour les formulaires
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  // État pour stocker l'utilisateur actuellement connecté
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Charger la session de l'utilisateur s'il était déjà connecté
  useEffect(() => {
    const activeSession = localStorage.getItem("maisssty_current_user");
    if (activeSession) {
      setCurrentUser(JSON.parse(activeSession));
      setIsLoggedIn(true);
    }
  }, []);

  // 🪄 ACTION : Inscription d'un nouveau client
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    // Récupérer la liste des utilisateurs existants
    const savedUsers = localStorage.getItem("maisssty_users");
    const usersList = savedUsers ? JSON.parse(savedUsers) : [];

    // Vérifier si l'email existe déjà
    const emailExists = usersList.some((u: any) => u.email.toLowerCase() === email.toLowerCase());
    
    if (emailExists) {
      alert("🚨 Cette adresse email est déjà utilisée par un autre membre.");
      return;
    }

    // Créer le nouvel utilisateur
    const newUser = {
      id: "USER-" + Date.now(),
      name: fullName,
      email: email.toLowerCase(),
      password: password // En production réelle, ce sera crypté !
    };

    // Sauvegarder dans notre base locale
    usersList.push(newUser);
    localStorage.setItem("maisssty_users", JSON.stringify(usersList));

    // Connecter automatiquement l'utilisateur
    localStorage.setItem("maisssty_current_user", JSON.stringify(newUser));
    setCurrentUser(newUser);
    setIsLoggedIn(true);
    
    // Nettoyer les champs
    setFullName(""); setEmail(""); setPassword("");
    alert("✨ Votre compte Maissty a été créé avec succès !");
  };

  // 🪄 ACTION : Connexion sécurisée
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const savedUsers = localStorage.getItem("maisssty_users");
    const usersList = savedUsers ? JSON.parse(savedUsers) : [];

    // Chercher l'utilisateur avec le bon email et le bon mot de passe
    const foundUser = usersList.find(
      (u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!foundUser) {
      alert("❌ Email ou mot de passe incorrect. Veuillez réessayer.");
      return;
    }

    // Si trouvé, on ouvre la session
    localStorage.setItem("maisssty_current_user", JSON.stringify(foundUser));
    setCurrentUser(foundUser);
    setIsLoggedIn(true);

    // Nettoyer les champs
    setEmail(""); setPassword("");
  };

  // 🪄 ACTION : Déconnexion propre
  const handleLogout = () => {
    localStorage.removeItem("maisssty_current_user");
    setCurrentUser(null);
    setIsLoggedIn(false);
    setIsRegistering(false);
  };

  return (
    <div className="min-h-screen bg-[#FDF6F3] text-[#2C1810] font-inter py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {!isLoggedIn ? (
          <div className="bg-white max-w-md mx-auto p-8 rounded-3xl border border-[#F0DDD8]/60 shadow-sm space-y-6">
            
            {/* 1. INTERFACE INSCRIPTION */}
            {isRegistering ? (
              <>
                <div className="text-center space-y-2">
                  <h1 className="font-playfair font-bold text-2xl uppercase tracking-wide">Créer un compte</h1>
                  <p className="text-xs text-[#8B6860]">Rejoignez la communauté Maissty Store</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <label className="block font-bold uppercase tracking-wider">Nom complet</label>
                    <input 
                      type="text" 
                      placeholder="Ex: Sarah Ben" 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-3 border border-[#F0DDD8] rounded-xl bg-[#FDF6F3] outline-none text-sm" 
                      required 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-bold uppercase tracking-wider">Adresse Email</label>
                    <input 
                      type="email" 
                      placeholder="Ex: client@mail.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 border border-[#F0DDD8] rounded-xl bg-[#FDF6F3] outline-none text-sm" 
                      required 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-bold uppercase tracking-wider">Mot de passe</label>
                    <input 
                      type="password" 
                      placeholder="Créer un mot de passe" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 border border-[#F0DDD8] rounded-xl bg-[#FDF6F3] outline-none text-sm" 
                      required 
                    />
                  </div>

                  <button type="submit" className="w-full bg-black text-white py-3.5 rounded-xl uppercase font-bold tracking-widest hover:bg-neutral-900 transition-colors cursor-pointer text-[11px] pt-4">
                    S&apos;inscrire et continuer
                  </button>
                </form>

                <div className="text-center pt-2">
                  <p className="text-[11px] text-[#8B6860]">
                    Déjà membre ?{" "}
                    <button onClick={() => { setIsRegistering(false); setEmail(""); setPassword(""); }} className="text-black font-bold underline cursor-pointer bg-transparent border-none outline-none">
                      Se connecter
                    </button>
                  </p>
                </div>
              </>
            ) : (
              /* 2. INTERFACE CONNEXION VÉRIFIÉE */
              <>
                <div className="text-center space-y-2">
                  <h1 className="font-playfair font-bold text-2xl uppercase tracking-wide">Mon Espace Maissty</h1>
                  <p className="text-xs text-[#8B6860]">Connectez-vous pour suivre vos commandes en cours</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <label className="block font-bold uppercase tracking-wider">Adresse Email</label>
                    <input 
                      type="email" 
                      placeholder="Ex: client@mail.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 border border-[#F0DDD8] rounded-xl bg-[#FDF6F3] outline-none text-sm" 
                      required 
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="block font-bold uppercase tracking-wider">Mot de passe</label>
                    <input 
                      type="password" 
                      placeholder="••••••••" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 border border-[#F0DDD8] rounded-xl bg-[#FDF6F3] outline-none text-sm" 
                      required 
                    />
                  </div>

                  <button type="submit" className="w-full bg-black text-white py-3.5 rounded-xl uppercase font-bold tracking-widest hover:bg-neutral-900 transition-colors cursor-pointer text-[11px] pt-4">
                    Se connecter
                  </button>
                </form>

                <div className="text-center pt-2">
                  <p className="text-[11px] text-[#8B6860]">
                    Nouveau client ?{" "}
                    <button onClick={() => { setIsRegistering(true); setEmail(""); setPassword(""); }} className="text-black font-bold underline cursor-pointer bg-transparent border-none outline-none">
                      Créer un compte
                    </button>
                  </p>
                </div>
              </>
            )}

          </div>
        ) : (
          /* 🛍️ L'ESPACE CLIENT PRIVÉ ET SÉCURISÉ */
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row items-center justify-between border-b border-[#F0DDD8] pb-6 gap-4">
              <div>
                {/* 🌟 Affiche le vrai prénom de la personne connectée */}
                <h1 className="font-playfair text-2xl font-bold uppercase tracking-wide">
                  Ravi de vous revoir, {currentUser?.name || "Client"} !
                </h1>
                <p className="text-xs text-[#8B6860] mt-1">Bienvenue dans votre espace privé Maissty Store</p>
              </div>
              <button 
                onClick={handleLogout} 
                className="flex items-center gap-2 border border-[#F0DDD8] bg-white px-4 py-2 rounded-xl text-xs font-semibold hover:text-red-500 transition-colors cursor-pointer"
              >
                <LogOut size={14} /> Déconnexion
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-[#F0DDD8]/60 shadow-sm space-y-3">
                <div className="w-8 h-8 bg-[#FDF6F3] text-black rounded-xl flex items-center justify-center border border-[#F0DDD8]"><Package size={16} /></div>
                <h3 className="font-playfair font-bold text-sm">Mes Achats</h3>
                <p className="text-xs text-[#8B6860]">Vous n&apos;avez aucune commande en cours de livraison pour le moment.</p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#F0DDD8]/60 shadow-sm space-y-3">
                <div className="w-8 h-8 bg-[#FDF6F3] text-black rounded-xl flex items-center justify-center border border-[#F0DDD8]"><MapPin size={16} /></div>
                <h3 className="font-playfair font-bold text-sm">Mon Adresse</h3>
                <p className="text-xs text-[#8B6860]">Configurez votre Wilaya et Commune par défaut pour vos prochaines livraisons.</p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#F0DDD8]/60 shadow-sm space-y-3">
                <div className="w-8 h-8 bg-[#FDF6F3] text-black rounded-xl flex items-center justify-center border border-[#F0DDD8]"><ShieldCheck size={16} /></div>
                <h3 className="font-playfair font-bold text-sm">Sécurité</h3>
                <p className="text-xs text-[#8B6860]">Votre compte est sécurisé localement sur cette machine.</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}