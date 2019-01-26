import React from "react";
import { BeatLoader } from "react-spinners";

const Spinner = () => (
  <div className="spinner">
    <BeatLoader color={"#1eaedb"} sizeUnit={"px"} size={30} margin={"4px"} />
  </div>
);

export default Spinner;
