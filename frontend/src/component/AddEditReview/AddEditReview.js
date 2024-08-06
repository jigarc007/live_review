import React, { useEffect, useState } from "react";
import "./AddEditReview.css";
import {
  EditReview,
  addReview,
  deleteReview,
} from "../../services/reviewServices";
import { useNavigate } from "react-router-dom";
import { useParams, useLocation } from "react-router-dom";
export default function NewReview() {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();

  const [formData, setFormData] = useState({
    id: params.id || 0,
    title: "",
    content: "",
    date_time: "",
  });
  console.log({ params });
  const handleSubmit = async (e) => {
    console.log({ formData });
    e.preventDefault();
    if (params?.id) {
      await EditReview(params.id, formData);
    } else {
      await addReview(formData);
    }
    navigate("/");
  };
  const handleChange = (key, val) => {
    setFormData({
      ...formData,
      [key]: val,
    });
  };
  useEffect(() => {
    const getData = async () => {
      if (params.id) {
        const reviewResponse = location.state?.filterReviewData;
        console.log({ reviewResponse });
        if (reviewResponse?._id) {
          const date = new Date(reviewResponse?.date_time);

          setFormData({
            title: reviewResponse?.title,
            id: reviewResponse?._id,
            content: reviewResponse?.content,
            date_time: `${date.getFullYear()}-${
              date.getMonth() < 10
                ? "0" + (date.getMonth() + 1)
                : Date.getMonth() + 1
            }-${date.getDate() < 10 ? "0" + date.getDate() : date.getDate()}T${
              date.getHours() < 10 ? "0" + date.getHours() : date.getHours()
            }:${
              date.getMinutes() < 10
                ? "0" + date.getMinutes()
                : date.getMinutes()
            }`,
          });
        }
      }
    };
    getData();
  }, []);
  const handleDelete = async (id) => {
    await deleteReview(id);
  };
  const handleReset = (event) => {
    event.preventDefault();
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        title: "",
        content: "",
      };
    });
  };
  return (
    <div>
      <center>
        <h1>Review Form</h1>
      </center>
      <form className={"addReviewform"}>
        <input
          value={formData?.title || ""}
          type="text"
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="Enter the title"
        />
        <textarea
          value={formData?.content || ""}
          rows={5}
          onChange={(e) => handleChange("content", e.target.value)}
          cols={20}
          placeholder="Enter the title"
        />
        <input
          value={formData?.date_time || ""}
          type="datetime-local"
          onChange={(e) => handleChange("date_time", e.target.value)}
        />
        <div>
          <button onClick={handleSubmit}>Save</button>&nbsp;&nbsp;
          {!params?.id && (
            <>
              <button onClick={handleReset}>Reset</button>&nbsp;&nbsp;
              <button onClick={() => navigate("/")}>Cancel</button>
            </>
          )}
          {params?.id && (
            <button onClick={() => handleDelete(params?.id)}>Delete</button>
          )}
        </div>
      </form>
    </div>
  );
}
