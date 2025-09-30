import FuneralHeader from './components/FuneralHeader';
import FuneralTable from './components/FuneralTable';
import CreateFuneralModal from './modals/CreateFuneralModal';
import { FuneralModalProvider } from '../../../contexts/FuneralModalContext';
import { useFuneralModal } from '../../../contexts/FuneralModalContext';


export default function FuneralsPage() {
        
    
    function FuneralContent(){
        const { openCreateFuneral } = useFuneralModal();

        return(
            <div className='flex flex-col w-full'>
                <FuneralHeader openCreateFuneral={openCreateFuneral} />
                <FuneralTable />
            </div>
        )
    }
    

    return(
        <FuneralModalProvider>
            <FuneralContent />
        </FuneralModalProvider>
    )
}