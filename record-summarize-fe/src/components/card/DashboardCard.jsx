import Scrollbars from "react-custom-scrollbars-2";
import './style.scss';

const DashboardCard = ({ children, sx }) => {
  return (
    <div className="dashboard-card">
      <Scrollbars>
        <div className="dashboard-card-inner">{children}</div>
      </Scrollbars>
    </div>
  );
};


export default DashboardCard;