//import {UserOutlined} from "@ant-design/icons";
import {useEffect, useState} from 'react';
import {BorrowYourCarContract, web3} from "../../utils/contracts";
import './index.css';
import InfiniteScroll from 'react-infinite-scroll-component';
import {Row,Col,Card, Table, Tag, Divider, Modal, Button, Image,  Avatar, List, Skeleton} from 'antd';
import {Header} from "../../assets";


const GanacheTestChainId = '0x539' // Ganache默认的ChainId = 0x539 = Hex(1337)
// TODO change according to your configuration
const GanacheTestChainName = 'Ganache Test Chain'
const GanacheTestChainRpcUrl = 'http://127.0.0.1:8545'


interface Car {
    tokenId: string;
}
const BorrowYourCarPage =()=>{

    const [account, setAccount] = useState('')
    const [borrowCarId,setBorrowCarId]=useState('')
    const [queryCarId,setQueryCarId]=useState('')
    const [borrowTime,setBorrowTime]=useState('')
    const [availableCars,setAvailableCars]=useState([])
    const [ownedCars,setOwnedCars]=useState([])
    const [carOwner,setCarOwner]=useState('')
    const [carBorrower,setCarBorrower]=useState('')


    useEffect(() => {
        // 初始化检查用户是否已经连接钱包
        // 查看window对象里是否存在ethereum（metamask安装后注入的）对象
        const initCheckAccounts = async () => {
            // @ts-ignore
            const {ethereum} = window;
            if (Boolean(ethereum && ethereum.isMetaMask)) {
                // 尝试获取连接的用户账户
                const accounts = await web3.eth.getAccounts()
                if(accounts && accounts.length) {
                    setAccount(accounts[0])
                }
            }
        }
        initCheckAccounts()
    },[])
    useEffect(() => {
        const getBorrowYourCarContractInfo = async () => {
            if (BorrowYourCarContract) {
                //const ma = await BorrowYourCarContract.methods.manager().call()
                //setManagerAccount(ma)
            } else {
                alert('Contract not exists.')
            }
        }
        getBorrowYourCarContractInfo()
    }, [])
    const onClickConnectWallet = async () => {
        // 查看window对象里是否存在ethereum（metamask安装后注入的）对象
        // @ts-ignore
        const {ethereum} = window;
        if (!Boolean(ethereum && ethereum.isMetaMask)) {
            alert('MetaMask is not installed!');
            return
        }

        try {
            // 如果当前小狐狸不在本地链上，切换Metamask到本地测试链
            if (ethereum.chainId !== GanacheTestChainId) {
                const chain = {
                    chainId: GanacheTestChainId, // Chain-ID
                    chainName: GanacheTestChainName, // Chain-Name
                    rpcUrls: [GanacheTestChainRpcUrl], // RPC-URL
                };

                try {
                    // 尝试切换到本地网络
                    await ethereum.request({method: "wallet_switchEthereumChain", params: [{chainId: chain.chainId}]})
                } catch (switchError: any) {
                    // 如果本地网络没有添加到Metamask中，添加该网络
                    if (switchError.code === 4902) {
                        await ethereum.request({ method: 'wallet_addEthereumChain', params: [chain]
                        });
                    }
                }
            }

            // 小狐狸成功切换网络了，接下来让小狐狸请求用户的授权
            //await ethereum.request({method: 'eth_requestAccounts'});
            await ethereum.request({ method: 'wallet_requestPermissions', params: [{ eth_accounts: {} }] });
            // 获取小狐狸拿到的授权用户列表
            const accounts = await ethereum.request({method: 'eth_accounts'});
            // 如果用户存在，展示其account，否则显示错误信息
            setAccount(accounts[0] || 'Not able to get accounts');
        } catch (error: any) {
            alert(error.message)
        }
    }
    const onQueryAvailableCars = async () => {
        if(account === '') {
            alert('You have not connected wallet yet.')
            return
        }
        if (BorrowYourCarContract) {
            try {
                const availableCars=await BorrowYourCarContract.methods.queryAvailableCars().call({
                    from: account
                })
                setAvailableCars(availableCars)
                alert('Query failed')
            } catch (error: any) {
                alert(error.message)
            }
        } else {
            alert('Contract not exists.')
        }

    };
    const onGetCar = async () => {
        if(account === '') {
            alert('You have not connected wallet yet.')
            return
        }
        if (BorrowYourCarContract) {
            try {
                await BorrowYourCarContract.methods.mintCars().send({
                    from: account
                })
                alert('No more cars to receive')
            } catch (error: any) {
                alert(error.message)
            }
        } else {
            alert('Contract not exists.')
        }
    }
    const onQueryCar = async () => {
        if(account === '') {
            alert('You have not connected wallet yet.')
            return
        }
        if (BorrowYourCarContract) {
            try {
                const _carOwner=await BorrowYourCarContract.methods.queryCarOwner(queryCarId).call({
                    from: account
                })
                const _carBorrower=await BorrowYourCarContract.methods.queryCarBorrower(queryCarId).call({
                    from: account
                })
                setCarOwner(_carOwner)
                setCarBorrower(_carBorrower)
                alert('Query failed')
            } catch (error: any) {
                alert(error.message)
            }
        } else {
            alert('Contract not exists.')
        }
    }
    const onBorrowCar = async () => {
        if(account === '') {
            alert('You have not connected wallet yet.')
            return
        }
        if (BorrowYourCarContract) {
            try {
                await BorrowYourCarContract.methods.borrowCar(borrowCarId,parseInt(borrowTime)).send({
                    from: account
                })
                alert('You cannot borrow this car')
            } catch (error: any) {
                alert(error.message)
            }
        } else {
            alert('Contract not exists.')
        }
    }
    const onQueryOwnedCars = async () => {
        if(account === '') {
            alert('You have not connected wallet yet.')
            return
        }
        if (BorrowYourCarContract) {
            try {
                const ownedCars = await BorrowYourCarContract.methods.queryOwnedCars().call({ from: account })
                setOwnedCars(ownedCars)
                alert('Query failed')
            } catch (error: any) {
                alert(error.message)
            }
        } else {
            alert('Contract not exists.')
        }
    }

    // @ts-ignore
    return (
        <div className='container'>
            <div className='title' style={{textAlign:"center"}}>
                <h1>很简易的汽车借用系统</h1>
            </div>
            <div className='account' style={{}}>
                {account === '' && <Button onClick={onClickConnectWallet}>连接钱包</Button>}
                <div>当前用户：{account === '' ? '无用户连接' : account}</div>
            </div>
            <div className='getCars' style={{}}>
                {<Button onClick={onGetCar}>领取车辆</Button>}
            </div>
            <div className="ownCars" style={{}}>
                <h2>已拥有的车辆</h2>
                {<Button onClick={onQueryOwnedCars}>查询已拥有车辆</Button>}
                <ul>
                    {ownedCars.map((car, index) => (
                        <li key={index}>
                            <p>车辆ID：{car}</p>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="availableCars" style={{}}>
                <h2>可借用的车辆</h2>
                {<Button onClick={onQueryAvailableCars}>查看可借用车辆</Button>}
                <ul>
                    {availableCars.map((car, index) => (
                        <li key={index}>
                            <Image
                                width={200} // 设置图片宽度
                            />
                            <p>车辆ID：{car}</p>
                        </li>

                    ))}
                </ul>
            </div>
            <div className="queryCar" style={{}}>
                <h2>查询车辆</h2>
                <span>车辆ID:</span>
                <input type={"number"} value={queryCarId} onChange={event => setQueryCarId(event.target.value)}/>
                {<Button onClick={onQueryCar}>查询车辆</Button>}
            </div>

        </div>
    )

}
export default BorrowYourCarPage;