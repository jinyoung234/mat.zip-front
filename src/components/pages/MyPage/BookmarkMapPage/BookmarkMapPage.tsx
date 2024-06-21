import CampusPinIcon from "../../../../asset/campus-pin-icon.svg";
import * as S from "./BookmarkMapPage.style";
import { useContext, useEffect, useState } from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import type { Campus } from "types/common";

import { NETWORK } from "constants/api";
import { CAMPUS_AREA_CENTER_POSITION, CAMPUS_POSITION } from "constants/campus";

import { LeftIcon } from "asset";

import { campusContext } from "context/CampusContextProvider";

import { Position, useMap } from "hooks/useMap";
import { useSlideCarousel } from "hooks/useSlideCarousel";

import fetchBookmarkList from "api/bookmark/fetchBookmarkList";

import ErrorImage from "components/common/ErrorImage/ErrorImage";
import EventMapMarker from "components/common/EventMapMarker/EventMapMarker";
import SlideCarousel from "components/common/SlideCarousel/SlideCarousel";
import Spinner from "components/common/Spinner/Spinner";
import StoreListItem from "components/common/StoreListItem/StoreListItem";
import Text from "components/common/Text/Text";
import { MESSAGES } from "constants/messages";
import { PATHNAME } from "constants/routes";

function BookmarkMapPage() {
  const navigate = useNavigate();
  const campusName = useContext(campusContext);

  const { data, isLoading, isFetching, isError, error } = useQuery("bookmarkStore", fetchBookmarkList, {
    retry: 0,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (error instanceof Error && error.message === MESSAGES.LOGIN_RETRY) {
      alert(error.message);
    }

    window.location.href = PATHNAME.HOME;
  }, [error]);

  const bookmarkedStores = data ?? [];

  const { center, positions, setCenter } = useMap(bookmarkedStores, CAMPUS_AREA_CENTER_POSITION[campusName!]);
  const [selectedMarker, setSelectedMarker] = useState<Position>();
  const { swiperRef, handleSlideToPosition } = useSlideCarousel();

  useEffect(() => {
    if (positions) setSelectedMarker(positions[0]);
  }, [positions]);

  const handleStoreChange = (id: number) => {
    const information = positions.find((store) => store.id === id)!;
    setSelectedMarker(information);
    setCenter(information.latlng);
  };

  const handleInformationSlide = (index: number) => {
    const { id } = bookmarkedStores[index];
    handleStoreChange(id);
  };

  const handlePinClick = (id: number) => {
    const index = positions.findIndex((position) => position.id === id);
    handleSlideToPosition(index);
    handleStoreChange(id);
  };

  return (
    <>
      <S.HeaderWrapper>
        <LeftIcon onClick={() => navigate(-1)} />
        <Text css={S.headerStyle}>나의 맛집 지도</Text>
      </S.HeaderWrapper>
      <S.MapWrapper>
        {(isLoading || isFetching) && <Spinner />}
        {isError && error instanceof Error && <ErrorImage errorMessage={error.message} />}
        <Map center={center} isPanto>
          <MapMarker
            position={CAMPUS_POSITION[campusName as Campus]}
            image={{
              src: CampusPinIcon,
              size: {
                width: 36,
                height: 36,
              },
            }}
            clickable={false}
          />
          {positions.map((position) => (
            <EventMapMarker
              key={position.id}
              markerPosition={position.latlng}
              isMarkerClicked={position.id === selectedMarker?.id}
              onMarkerClick={() => handlePinClick(position.id)}
            />
          ))}
        </Map>
      </S.MapWrapper>
      <S.StoreListWrapper>
        <SlideCarousel swiperRef={swiperRef} onSlideChange={handleInformationSlide}>
          {bookmarkedStores.map((store) => (
            <StoreListItem key={store.id} {...store} thumbnailUrl={store.imageUrl} />
          ))}
        </SlideCarousel>
      </S.StoreListWrapper>
    </>
  );
}

export default BookmarkMapPage;
