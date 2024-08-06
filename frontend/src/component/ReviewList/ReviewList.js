import React, { useEffect, useState } from "react";
import { deleteReview } from "../../services/reviewServices";
import { useNavigate } from "react-router-dom";

export default function ReviewList({ reviews }) {
  const [finalReviews, setFinalReviews] = useState(
    JSON.parse(JSON.stringify(reviews))
  );

  useEffect(() => {
    const updatedRecord = JSON.parse(localStorage.getItem("updatedRecord"));
    console.log({ updatedRecord });
    if (updatedRecord) {
      const findIndex = finalReviews?.findIndex(
        (review) => review._id === updatedRecord?._id
      );
      console.log({ findIndex });
      const finalReviewsData = [...finalReviews];
      if (findIndex >= 0) {
        finalReviewsData?.splice(findIndex, 1);
        finalReviewsData.unshift(updatedRecord);
        console.log({ finalReviewsData });
        setFinalReviews(finalReviewsData);
      } else {
        setFinalReviews(reviews);
      }
    } else {
      setFinalReviews(reviews);
    }
  }, [reviews]);
  const navigate = useNavigate();
  const handleEdit = async (id) => {
    const [filterReviewData]=finalReviews?.filter((review)=> review._id===id);
    console.log({filterReviewData})
    navigate(id,{state:{filterReviewData}});
  };
  const handleDelete = async (id) => {
    await deleteReview(id);
  };
  const handleAdd = () => {
    navigate("/new");
  };
  return (
    <div>
      <button onClick={handleAdd}>Add Review</button>
      <table>
        <tr>
          <th>#</th>
          <th>Title</th>
          <th>Content</th>
          <th>Date Time</th>
          <th>Edit</th>
          <th>Delete</th>
        </tr>
        <tbody>
          {finalReviews?.map((review, index) => (
            <tr key={`${review?._id}_${index}`}>
              <td>{review?._id}</td>
              <td>{review?.title}</td>
              <td>{review?.content}</td>
              <td>{review?.date_time}</td>
              <td>
                <button onClick={() => handleEdit(review?._id)}>Edit</button>
              </td>
              <td>
                <button
                  onClick={() => {
                    handleDelete(review?._id);
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
