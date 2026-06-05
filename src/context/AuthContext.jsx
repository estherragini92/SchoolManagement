import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

const defaultUsers = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@school.com",
    password: "admin123",
    role: "admin",
    avatar: "A",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "teacher@school.com",
    password: "teacher123",
    role: "teacher",
    subject: "Mathematics",
    avatar: "S",
  },
  {
    id: 3,
    name: "David Smith",
    email: "parent@school.com",
    password: "parent123",
    role: "parent",
    studentName: "Alice Freeman",
    avatar: "D",
  },
];

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem("edusmartUsers");
    return savedUsers ? JSON.parse(savedUsers) : defaultUsers;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem("edusmartCurrentUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    localStorage.setItem("edusmartUsers", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("edusmartCurrentUser", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("edusmartCurrentUser");
    }
  }, [currentUser]);

  const login = (email, password, role) => {
    const foundUser = users.find(
      (user) =>
        user.email.toLowerCase() === email.toLowerCase() &&
        user.password === password &&
        user.role === role
    );

    if (!foundUser) {
      return {
        success: false,
        message: "Invalid email, password or role",
      };
    }

    const loggedInUser = {
      id: foundUser.id,
      name: foundUser.name,
      email: foundUser.email,
      role: foundUser.role,
      subject: foundUser.subject || "",
      studentName: foundUser.studentName || "",
      avatar: foundUser.avatar || foundUser.name.charAt(0).toUpperCase(),
    };

    setCurrentUser(loggedInUser);

    return {
      success: true,
      user: loggedInUser,
    };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const addUser = (userData) => {
    const newUser = {
      id: Date.now(),
      ...userData,
      avatar: userData.name?.charAt(0).toUpperCase() || "U",
    };

    setUsers((prev) => [newUser, ...prev]);

    return newUser;
  };

  const updateUser = (id, updatedData) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === id
          ? {
              ...user,
              ...updatedData,
            }
          : user
      )
    );
  };

  const deleteUser = (id) => {
    setUsers((prev) => prev.filter((user) => user.id !== id));
  };

  return (
    <AuthContext.Provider
      value={{
        users,
        currentUser,
        isAuthenticated: !!currentUser,
        login,
        logout,
        addUser,
        updateUser,
        deleteUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}