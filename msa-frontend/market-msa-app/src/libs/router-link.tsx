import { forwardRef } from 'react';
import { createLink, type LinkComponent } from '@tanstack/react-router';
import { Button as MuiButton, type ButtonProps } from '@mui/material';

type MuiButtonLinkProps = Omit<ButtonProps<'a'>, 'href'>;

const MuiButtonAnchor = forwardRef<HTMLAnchorElement, MuiButtonLinkProps>(
  function MuiButtonAnchor(props, ref) {
    return <MuiButton ref={ref} component="a" {...props} />;
  },
);

const CreatedButtonLink = createLink(MuiButtonAnchor);

export const ButtonLink: LinkComponent<typeof MuiButtonAnchor> = (props) => (
  <CreatedButtonLink preload="intent" {...props} />
);
