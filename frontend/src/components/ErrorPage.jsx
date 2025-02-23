export default function ErrorPage(props) {
  return (
      <div className={"error-page"}>
          <div className={"message"} style={{color:"red"}}>{props.message}</div>
      </div>
  );
}