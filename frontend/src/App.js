import React, { useState, useEffect, useCallback } from "react";
import {
  // BrowserRouter,
  // Routes,
  // Route,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./App.css";
// import { useNavigate } from "react-router-dom";
import ReviewList from "./component/ReviewList/ReviewList";
import AddEditReview from "./component/AddEditReview/AddEditReview";
import {getReview, deleteReview} from  './services/reviewServices';
import { io } from 'socket.io-client';

function App() {
  const [reviews, setReviews] = useState([]);
  const [ws, setWs] = useState(null);


  useEffect(() => {
    getReview()?.then((response) => {
      console.log({ response });
      setReviews(response);
    });

    const socket = io('http://localhost:3001');

    socket.on("connect_error", (err) => {
      console.log(err.message);
      console.log(err.description);
      console.log(err.context);
    });



    socket.on('connect', () => {
      console.log('Connected to Socket.IO server');
    });

    socket.on('ADD_ITEM', (item) => {
      handleWebSocketMessage('ADD_ITEM', item);
    });

    socket.on('EDIT_ITEM', (item) => {
     handleWebSocketMessage('EDIT_ITEM', item);
    });

    socket.on('DELETE_ITEM', (itemId) => {
      handleWebSocketMessage('DELETE_ITEM', itemId);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server');
    });
    setWs(socket);
    return () => {
      socket.disconnect();
    };
  }, []);

  const handleWebSocketMessage = useCallback((type, message) => {
    switch (type) {
      case "ADD_ITEM":
        setReviews((prevItems) => [message,...prevItems]);
        break;
      case "EDIT_ITEM":
        const updatedRecord=JSON.parse(localStorage.getItem('updatedRecord')) || message;
        const findIndex = reviews?.findIndex(
          (review) => review._id === updatedRecord?._id
        );
        console.log(findIndex);
        const reviewData = [...reviews];
        if (findIndex >= 0) {
          reviewData?.splice(findIndex,1)
          reviewData.unshift(updatedRecord)
          console.log({reviewData})
          setReviews(reviewData);
        }
        break;
      case "DELETE_ITEM":
        setReviews((prevItems) =>
          prevItems.filter((item) => item._id !== message?._id)
        );
        break;
      default:
        break;
    }
  },[reviews]);
  const router = createBrowserRouter([
    {
      path: "/",
      element: <ReviewList reviews={reviews} />,
    },
    {
      path: "new",
      element: <AddEditReview />,
    },
    {
      path: ":id",
      element: <AddEditReview />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
