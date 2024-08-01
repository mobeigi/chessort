import { Helmet } from 'react-helmet-async';
import type { StatCounterProps } from './types';

export const StatCounter = ({ project, security }: StatCounterProps) => {
  return (
    <Helmet>
      <script type="text/javascript">
        {`var sc_project="${project}"; var sc_invisible=1; var sc_security="${security}";`}
      </script>
      <script type="text/javascript" src="https://www.statcounter.com/counter/counter.js" async></script>
      <noscript>
        {`
        <div className="statcounter">
          <a title="Web Analytics" href="https://statcounter.com/" target="_blank">
            <img
              className="statcounter"
              src="https://c.statcounter.com/13023123/0/9534bd42/1/"
              alt="Web Analytics"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </a>
        </div>
        `}
      </noscript>
    </Helmet>
  );
};
