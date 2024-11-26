import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { AppLayout } from "./components/layout/AppLayout"
import "./css/pokemonMainPage.css"
import { MainPage } from "./pages/MainPage"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { IndividualPage } from "./pages/IndividualPage"
import { GamePage } from "./pages/GamePAge"
import { Game } from "./components/ui/Game"
const router = createBrowserRouter([
  {
    path:"/",
    element:<AppLayout />,
    children:[
      {
        path:"/",
        element:<MainPage />,
      },
      {
        path:"/:id",
        element:<IndividualPage />,
      },
      {
        path:"/game",
        element:<GamePage />,
      },
      {
        path:"/game-battle",
        element:<Game />,
      }
    ]
  }
])
function App() { 
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient} >
    <RouterProvider router = {router}/>
  </QueryClientProvider> 
}

export default App
