import styled from "styled-components";

import type { StoreListItemProps } from "./StoreListItem";

import StoreListItem from "./StoreListItem";

export interface StoreListProps {
  stores: (StoreListItemProps & { storeId: number })[];
}

const StoreListContainer = styled.ul`
  width: 100%;
`;

function StoreList({ stores }: StoreListProps) {
  return (
    <StoreListContainer>
      {stores.map((store) => (
        <StoreListItem
          key={store.storeId}
          thumbnailUrl={store.thumbnailUrl}
          name={store.name}
          campus={store.campus}
          distance={store.distance}
          starCount={store.starCount}
        />
      ))}
    </StoreListContainer>
  );
}

export default StoreList;
