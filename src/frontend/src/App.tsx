import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./components/Landing";
import ImageDetectionComponent from "./components/ImageDetectionComponent";
import LiveDetectionComponent from "./components/LiveDetectionComponent";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />}></Route>
        <Route path={`/jenji/live`} element={<LiveDetectionComponent />} />
        <Route path="/jenji/predict/upload" element={<ImageDetectionComponent />}></Route>
      </Routes>
    </BrowserRouter>
  );
}
