import { useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LibraryView from "./components/LibraryView";
import ReaderView from "./components/ReaderView";

function App() {
    useEffect(() => { }, []);

    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<LibraryView />} />
                    <Route path="/reader/:bookId" element={<ReaderView />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;

