import React, { useEffect, useState } from "react";

const API_BASE_URL = "http://localhost:3001";

export const AuthContext = React.createContext({});

const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      return { token: data.token, user: data.user };
    } else if (response.status === 401) {
      return { error: "Invalid email or password" };
    } else {
      return { error: "Network response was not OK." };
    }
  } catch (error) {
    return { error: `Error during login: ${error.message}` };
  }
};

const updateUser = async (updates, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/update/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });

    if (response.ok) {
      const data = await response.json();
      return { success: true, user: data };
    } else {
      const errorData = await response.json();
      return { error: errorData.error || "Update failed" };
    }
  } catch (error) {
    return { error: `Error during update: ${error.message}` };
  }
};

const registerUser = async (email, password, firstName, lastName, role) => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, firstName, lastName, role }),
    });
    if (response.ok) {
      return { success: true };
    } else {
      const jsonData = await response.json();
      return { error: `Registration failed: ${jsonData.error}` };
    }
  } catch (error) {
    return { error: `Error during registration: ${error.message}` };
  }
};

const deleteAccount = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/delete/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      return { success: true };
    } else {
      return { error: "Network response was not OK." };
    }
  } catch (error) {
    return { error: `Error during account deletion: ${error.message}` };
  }
};

const fetchUserData = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/me`, {
      // Replace `/user/me` with the correct endpoint to get user data.
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return { user: data.user };
    } else if (response.status === 401) {
      return {
        error: "Please login again.",
        isUnauthorized: true,
      };
    } else {
      return { error: "Failed to fetch user data." };
    }
  } catch (error) {
    return { error: `Error fetching user data: ${error.message}` };
  }
};

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      handleFetchUserData(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const handleFetchUserData = async (token) => {
    setLoading(true);
    const result = await fetchUserData(token);
    if (result.user) {
      setUser(result.user); // Set the user data in the state.
      setToken(token);
    } else if (result.isUnauthorized) {
      // Handle invalid token case
      setError(result.error);
      handleLogout();
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleLogin = async (email, password) => {
    setLoading(true);
    const result = await loginUser(email, password);
    if (result.token) {
      setToken(result.token);
      setUser(result.user);
      localStorage.setItem("token", result.token);
    } else {
      setError(result.error);
    }
    setLoading(false);
    return { user: result.user, token: result.token };
  };

  const handleLogout = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem("token");
  };

  const handleDelete = async () => {
    setLoading(true);
    const result = await deleteAccount(token);
    if (result.success) {
      handleLogout();
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleUpdate = async (updates) => {
    setLoading(true);
    const result = await updateUser(updates, token);
    if (result.success) {
      setUser(result.user);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleRegister = async (
    email,
    password,
    firstName,
    lastName,
    role,
    callback
  ) => {
    setLoading(true);
    const result = await registerUser(
      email,
      password,
      firstName,
      lastName,
      role
    );
    if (result.error) {
      setError(result.error);
      if (callback) callback(false, result.error); // Call the callback with error
    } else {
      setError("");
      const userAndToken = await handleLogin(email, password);
      if (callback) callback(true, null); // Call the callback with success
      return userAndToken;
    }
    setLoading(false);
  };

  const fetchWithToken = async (url, options = {}) => {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        return response;
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Network response was not OK.");
      }
    } catch (error) {
      setError(`Error fetching data: ${error.message}`);
    }
  };

  const isAuthenticated = () => {
    return !!token;
  };

  const authContextValue = {
    user,
    setUser,
    loading,
    error,
    setError,
    handleLogin,
    handleLogout,
    handleDelete,
    handleRegister,
    fetchWithToken,
    isAuthenticated,
    handleUpdate,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
