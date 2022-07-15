import imageUrlBuilder from "@sanity/image-url";
import { useState, useEffect } from "react";
import Head from "next/head";
import styles from "../../styles/Post.module.css";
import BlockContent from "@sanity/block-content-to-react";
import { Toolbar } from "../../components/toolbar";

export const Post = ({
  title,
  body,
  image,
  ogImage,
  ogTitle,
  ogDescription,
}) => {
  const [imageUrl, setImageUrl] = useState("∫∫");

  useEffect(() => {
    const imgBuilder = imageUrlBuilder({
      projectId: "4shyznw3",
      dataset: "production",
    });

    setImageUrl(imgBuilder.image(image));
  }, [image]);

  return (
    <>
      <Head>
        <meta property="og:title" content={ogTitle} />
        <meta property="og:description" content={ogDescription} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content="https://visitor.is" />
      </Head>
      <div>
        <Toolbar />
        <div className={styles.main}>
          <h1>{title}</h1>
          {imageUrl && <img className={styles.mainImage} src={imageUrl} />}

          <div className={styles.body}>
            <BlockContent blocks={body} />
          </div>
        </div>
      </div>
    </>
  );
};

export const getServerSideProps = async (pageContext) => {
  const pageSlug = pageContext.query.slug;

  if (!pageSlug) {
    return {
      notFound: true,
    };
  }

  const query = encodeURIComponent(
    `*[ _type == "post" && slug.current == "${pageSlug}" ]`
  );
  const url = `https://4shyznw3.api.sanity.io/v1/data/query/production?query=${query}`;

  const result = await fetch(url).then((res) => res.json());
  const post = result.result[0];

  if (!post) {
    return {
      notFound: true,
    };
  } else {
    const ogImage = imageUrlBuilder({
      projectId: "4shyznw3",
      dataset: "production",
    })
      .width(120)
      .image(post.mainImage)
      .toString();

    const ogTitle = post.title;

    const ogDescription = post.description;

    return {
      props: {
        body: post.body,
        title: post.title,
        image: post.mainImage,
        ogImage,
        ogTitle,
        ogDescription,
      },
    };
  }
};

export default Post;
