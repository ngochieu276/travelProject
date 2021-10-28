import React from "react";
import AwesomeSlider from "react-awesome-slider";
import "react-awesome-slider/dist/styles.css";

const Banner = () => {
  return (
    <AwesomeSlider>
      <div data-src='https://static8.depositphotos.com/1115174/860/v/600/depositphotos_8605128-stock-illustration-postal-card-travel-background.jpg' />
      <div data-src='https://lp-cms-production.imgix.net/2021-01/shutterstockRF_718619590.jpg?auto=format&fit=crop&sharp=10&vib=20&ixlib=react-8.6.4&w=850' />
      <div data-src='http://banvouchervinpearlgiare.com/wp-content/uploads/2020/01/voucher-vinpearl-phu-quoc-1.jpg' />
    </AwesomeSlider>
  );
};

export default Banner;
