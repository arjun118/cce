import { useState } from "react";
import "./App.css";
import Register from "./components/auth/Register";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/auth/Login";
import Layout from "./components/auth/Layout";
import Missing from "./components/Missing";
import RequireAuth from "./components/auth/RequireAuth";
import Home from "./components/Home";
import Users from "./components/Users";
import PersistLogin from "./components/auth/PersistLogin";
import Test from "./components/chat/Test";
import Room from "./components/chat/Room";
function App() {
  const [count, setCount] = useState(0);

  return (
    <main>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* public routes */}
            <Route path="/room" element={<Room />} />
            <Route path="/test" element={<Test />} />
            <Route element={<PersistLogin />}>
              <Route path="/auth/signup" element={<Register />} />
              <Route path="/auth/login" element={<Login />} />
            </Route>
            {/* Protected routes */}
            <Route element={<PersistLogin />}>
              <Route element={<RequireAuth />}>
                <Route path="/home" element={<Home />} />
                <Route path="/users" element={<Users />} />
              </Route>
            </Route>

            {/* missing */}
            <Route path="*" element={<Missing />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </main>
  );
}

export default App;
