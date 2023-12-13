import { Navigate, createBrowserRouter } from "react-router-dom";
import Layout from "../layouts/Layout/Layout";
import Chat from "../pages/Chat";
import Chatting from "../pages/Chat/Chatting";
import ChattingContainer from "../pages/Chat/Chatting/index.container";
import Integration from "../pages/Integration";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Navigate to="/chat" />
      },
      {
        path: "chat",
        element: <Chat />,
        children: [
          // {
          //   path: "create",
          //   element: <ChattingContainer />
          // },
          {
            path: ":chatId",
            element: <ChattingContainer />
          }
        ]
      },
      {
        path: "integration",
        element: <Integration />,
        children: [
          {
            path: "",
            element: <></>
          },
          {
            path: ":integrationId",
            element: <ChattingContainer />,
            children: [
              {
                path: ":chatId",
                element: <></>
              }
            ]
          }
        ]
      },
      {
        path: "*",
        element: <Navigate to="/chat" />
      }
    ]
  }
]);
