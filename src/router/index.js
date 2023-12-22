import { Navigate, createBrowserRouter } from "react-router-dom";
import Layout from "../layouts/Layout/Layout";
import Chat from "../pages/Chat";
import ChattingContainer from "../pages/Chat/Chatting/index.container";
import Integration from "../pages/Integration";
import FallbackPage from "../components/FallbackPage";
import Users from "../pages/Users";
import Audit from "../pages/Audit";

export const userRouter = createBrowserRouter([
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

export const adminRouter = createBrowserRouter([
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
        path: "users",
        element: <Users />
      },
      {
        path: "audit",
        element: <Audit />,
        children: [
          {
            path: ":userId",
            element: <Chat isAudit={true} />,
            children: [
              {
                path: ":chatId",
                element: <ChattingContainer />
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

export const emptyRoutes = createBrowserRouter([
  {
    path: "/",
    element: <FallbackPage />
  },
  {
    path: "*",
    element: <Navigate to="/" />
  }
]);
