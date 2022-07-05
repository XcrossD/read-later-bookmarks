import { ReactElement, useEffect, useRef, useState } from "react";
import { Classes } from "@blueprintjs/core";

interface BookmarkImageProps {
  imageSource: string;
}

const BookmarkImage = (props: BookmarkImageProps) => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [height, setHeight] = useState<number>(200);
  const [width, setWidth] = useState<number>(200);
  const ref = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (ref.current) {
      setHeight(ref.current.clientHeight);
      setWidth(ref.current.clientWidth);
    }
  }, [ref]);
  
  return (
    <img
      ref={ref}
      className={`bookmark-card-image ${loaded ? '' : Classes.SKELETON}`}
      src={props.imageSource.length > 0 ? props.imageSource : `https://picsum.photos/${width}/${height}`}
      onLoad={() => setLoaded(true)}
      alt={'Thumbnail'}
    />
  );
}

export default BookmarkImage;