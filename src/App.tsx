import Content from './pages/Content'
import  Landing from './pages/Landing'

import { BrowserRouter, Routes, Route } from "react-router-dom"




 

function App() {
 return <>
<BrowserRouter  >

<Routes>
          <Route path="/" element={<Landing />} /> 
          <Route path="/chat" element={<Content />} /> 


</Routes>

</BrowserRouter>
 
 
 
 
 </>
}


export default App
