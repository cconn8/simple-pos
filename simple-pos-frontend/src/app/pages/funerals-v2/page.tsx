import FuneralHeader from './components/FuneralHeader';
import FuneralTable from './components/FuneralTable';
import CreateFuneralModal from './modals/CreateFuneralModal';
import { FuneralModalProvider } from '../../../contexts/FuneralModalContext';
import { useFuneralModal } from '../../../contexts/FuneralModalContext';
import { FuneralsProvider } from '@/contexts/FuneralsContext';



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
    
    // Remove FuneralModalProvider once FuneralProvider is built properly
    return(
        <FuneralModalProvider> 
            <FuneralsProvider>
                <FuneralContent />
            </FuneralsProvider>
        </FuneralModalProvider>
    )
}