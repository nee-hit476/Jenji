import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./components/Landing";
import ImageDetectionComponent from "./components/ImageDetectionComponent";
import LiveDetectionComponent from "./components/LiveDetectionComponent";
import Documentation from "./components/Documentation";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />}></Route>
        <Route path={`/jenji/live`} element={<LiveDetectionComponent />} />
        <Route path="/jenji/predict/upload" element={<ImageDetectionComponent />}></Route>
        <Route path="/jenji/docs" element={<Documentation />}></Route>
      </Routes>
    </BrowserRouter>
  );
}
