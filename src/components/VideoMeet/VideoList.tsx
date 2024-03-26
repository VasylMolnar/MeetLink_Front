import VideoPlayer from "../VideoPlayer/VideoPlayer";
import { Col, Row } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const VideoList = ({ streams }: any) => {
  let nextSlideIndex = 8;
  // let nextSlideIndex = 5;
  let slideIndex = 0;

  let nextRowIndex = 0;
  let rowIndex = 0;

  const generalStream = streams.reduce(
    (acc: any, item: any, index: number) => {
      if (index <= nextSlideIndex) {
        if (!acc[slideIndex]) {
          acc[slideIndex] = [];
        }

        if (!acc[slideIndex][rowIndex]) {
          acc[slideIndex][rowIndex] = [];
        }

        acc[slideIndex][rowIndex].push(item);

        nextRowIndex++;
      }

      if (nextRowIndex === 3) {
        rowIndex++;
        nextRowIndex = 0;
      }

      if (index === nextSlideIndex) {
        nextSlideIndex += 9;
        // nextSlideIndex += 6;

        slideIndex += 1;
        rowIndex = 0;
      }
      return acc;
    },
    [[]]
  );

  return (
    <Swiper
      // spaceBetween={30}
      navigation={true}
      modules={[Navigation]}
      className="mySwiper"
    >
      {generalStream.map((slide: any, index: any) => (
        <SwiperSlide key={index} className="slide">
          {slide.map((rowItem: any, index: any) => (
            <>
              <Row key={index}>
                {rowItem.map((colItem: any, index: any) => (
                  <Col key={index} lg={true} className="video-screen">
                    <VideoPlayer stream={colItem} />
                  </Col>
                ))}
              </Row>
            </>
          ))}
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default VideoList;

//     <VideoPlayer stream={colItem} />
