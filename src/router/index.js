import { Navigate, createBrowserRouter } from "react-router-dom";
import Layout from "../layouts/Layout/Layout";
import Chat from "../pages/Chat";
import ChattingContainer from "../pages/Chat/Chatting/index.container";
import Integration from "../pages/Integration";
import FallbackPage from "../components/FallbackPage";
import Users from "../pages/Users";
import Audit from "../pages/Audit";
import SnowflakeCallback from "../pages/Auth/Callback/snowflake";
import SnowflakeConfig from "../pages/Configs/Snowflake";
import SnowflakeConfigAdd from "../pages/Configs/Snowflake/add";
import ColumnsTable from "../pages/Integration/ColumnDetails/Columns";
import PreviewData from "../pages/Integration/ColumnDetails/PreviewData";
import Store from "../pages/Integration/ColumnDetails/Store";
import AssistantChat from "../pages/Assistant/Chat";
import AssistantConfig from "../pages/Assistant/Config";

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
                children: [
                  {
                    path: "columns",
                    children: [
                      {
                        path: ":columnName",
                        element: <ColumnsTable />
                      }
                    ]
                  },
                  {
                    path: "preview",
                    children: [
                      {
                        path: ":columnName",
                        element: <PreviewData />
                      }
                    ]
                  },
                  {
                    path: "store",
                    children: [
                      {
                        path: ":fileId",
                        element: <Store />
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        path: "callback",
        children: [
          {
            path: "snowflake",
            element: <SnowflakeCallback />
          }
        ]
      },
      {
        path: "configs",
        children: [
          {
            path: "snowflake",
            children: [
              {
                index: true,
                element: <SnowflakeConfig />
              },
              {
                path: "add",
                element: <SnowflakeConfigAdd />
              },
              {
                path: ":id",
                element: <SnowflakeConfigAdd />
              }
            ]
          }
        ]
      },
      {
        path: "callback",
        children: [
          {
            path: "snowflake",
            element: <SnowflakeCallback />
          }
        ]
      },
      {
        path: "configs",
        children: [
          {
            path: "snowflake",
            children: [
              {
                index: true,
                element: <SnowflakeConfig />
              },
              {
                path: "add",
                element: <SnowflakeConfigAdd />
              },
              {
                path: ":id",
                element: <SnowflakeConfigAdd />
              }
            ]
          }
        ]
      },
      {
        path: "assistant",
        children: [
          {
            path: "chat/:assistantId",
            element: <AssistantChat />,
            children: [
              {
                path: ":chatId",
                element: <ChattingContainer />
              }
            ]
          },
          {
            path: "config/:id",
            element: <AssistantConfig />
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
                children: [
                  {
                    path: "columns",
                    children: [
                      {
                        path: ":columnName",
                        element: <ColumnsTable />
                      }
                    ]
                  },
                  {
                    path: "preview",
                    children: [
                      {
                        path: ":columnName",
                        element: <PreviewData />
                      }
                    ]
                  },
                  {
                    path: "store",
                    children: [
                      {
                        path: ":fileId",
                        element: <Store />
                      }
                    ]
                  }
                ]
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
        path: "callback",
        children: [
          {
            path: "snowflake",
            element: <SnowflakeCallback />
          }
        ]
      },
      {
        path: "*",
        element: <Navigate to="/chat" />
      },
      {
        path: "configs",
        children: [
          {
            path: "snowflake",
            children: [
              {
                index: true,
                element: <SnowflakeConfig />
              },
              {
                path: "add",
                element: <SnowflakeConfigAdd />
              },
              {
                path: ":id",
                element: <SnowflakeConfigAdd />
              }
            ]
          }
        ]
      },
      {
        path: "assistant",
        children: [
          {
            path: "chat/:assistantId",
            element: <AssistantChat />,
            children: [
              {
                path: ":chatId",
                element: <ChattingContainer />
              }
            ]
          },
          {
            path: "config/:id",
            element: <AssistantConfig />
          }
        ]
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
