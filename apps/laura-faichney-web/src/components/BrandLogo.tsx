type BrandLogoProps = { footer?: boolean };

export function BrandLogo(props: BrandLogoProps) {
  return (
    <a
      className={props.footer ? 'wordmark wordmark-footer' : 'wordmark'}
      href="/"
    >
      <img
        src="/brand/laura-faichney-signature.webp"
        srcSet="/brand/laura-faichney-signature-220.webp 220w, /brand/laura-faichney-signature-320.webp 320w, /brand/laura-faichney-signature-440.webp 440w, /brand/laura-faichney-signature.webp 660w"
        sizes="(max-width: 640px) 180px, (max-width: 900px) 175px, 220px"
        decoding="async"
        alt="Laura Faichney — All Things Art"
        width="660"
        height="220"
      />
    </a>
  );
}
