export function BrandLogo(props: { footer?: boolean }) {
  return (
    <a
      className={props.footer ? 'wordmark wordmark-footer' : 'wordmark'}
      href="/"
    >
      <img
        src="/brand/laura-faichney-signature.png"
        alt="Laura Faichney — All Things Art"
        width="2172"
        height="724"
      />
    </a>
  );
}
