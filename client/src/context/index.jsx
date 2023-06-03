// we will have all our smart contract interactions in this one single file - this is the best practice when working with web3 projects
// This is a place where we are going to store all our web3 logic and then we are going to wrap our application with this context so that every single page and component can use it without any problem

import React, { useContext, createContext } from "react";

// things we need from thirdweb
import {
    useAddress,
    useContract,
    useMetamask,
    useContractWrite,
} from "@thirdweb-dev/react";

import { ethers } from "ethers";

//creating context
const StateContext = createContext();

//create and export our context provider
// it is a regular react functional component but it has children inside of props so we can get those children that allows us to wrap our entire application with the ocntext provider but then still render all the children that are inside of it
export const StateContextProvider = ({ children }) => {
    // connecting the smart contract
    const { contract } = useContract(
        "0xf240398e73A808Db5AC4f51e56493947cb337Be7"
    ); //providing our contract address from thirdweb

    //there are two ways to call the write functions

    // ================================ METHOD - II =====================================
    // Other way is to call the contract.call() and then pass everything you need

    // ================================ METHOD - I =====================================
    const { mutateAsync: createCampaign } = useContractWrite(
        contract,
        "createCampaign"
    );
    //↑↑↑↑↑ here we are using 'mutateAsync' and renaming it to 'createCampaign'. Then we use 'useContractWrite', pass in our contract and call the 'createCampaign' function from our smart contract.
    //↑↑↑↑↑ this will allow us to simply call the 'createCampaign' function and create a campaign by passing all of the parameters.

    // address of the smart wallet ↓↓↓↓
    const address = useAddress();
    const connect = useMetamask(); //connects to the wallet

    // ================ FUNCTIONS ================

    // =============== FUNCTION 1 ================
    const publishCampaign = async (form) => {
        try {
            const data = await createCampaign([
                address, //owner
                form.title, //title
                form.description, //description
                form.target, //target
                new Date(form.deadline).getTime(), //deadline
                form.image, //imageUrl
            ]);

            console.log("contract call success", data);
        } catch (error) {
            console.log("contract call failure", error);
        }
    };

    // =============== FUNCTION 2 ================
    const getCampaigns = async () => {
        const campaigns = await contract.call("getCampaigns");
        // console.log(campaigns);

        const parsedCampaigns = campaigns.map((campaign, i) => ({
            owner: campaign.owner,
            title: campaign.title,
            description: campaign.description,
            target: ethers.utils.formatEther(campaign.target.toString()),
            deadline: campaign.deadline.toNumber(),
            amountCollected: ethers.utils.formatEther(
                campaign.amountCollected.toString()
            ),
            image: campaign.image,
            pId: i,
        }));
        // console.log("Parsed Campaign : \n", parsedCampaigns);
        return parsedCampaigns;
    };

    // =============== FUNCTION 3 ================
    const getUserCampaigns = async () => {
        const allCampaigns = await getCampaigns();

        //keep only those campaigns which are created by current user
        const filteredCampaigns = allCampaigns.filter(
            (campaign) => campaign.owner === address
        );

        return filteredCampaigns;
    };

    // =============== FUNCTION 4 ================
    const donate = async (pId, amount) => {
        const data = await contract.call("donateToCampaign", pId, {
            value: ethers.utils.parseEther(amount),
        });

        return data;
    };

    // =============== FUNCTION 5 ================
    const getDonations = async (pId) => {
        const donations = await contract.call("getDonators", pId);
        const numberOfDonations = donations[0].length;

        const parsedDonations = [];

        for (let i = 0; i < numberOfDonations; i++) {
            parsedDonations.push({
                donator: donations[0][i],
                donation: ethers.utils.formatEther(donations[1][i].toString()),
            });

            
        }
        return parsedDonations;
    };

    return (
        <StateContext.Provider
            value={{
                address,
                contract,
                connect,
                createCampaign: publishCampaign, //renaming publishCampaign to createCampaign
                getCampaigns,
                getUserCampaigns,
                donate,
                getDonations,
            }} //value will contain all the data that you want to pass/share across all your components
        >
            {children}
        </StateContext.Provider>
    );
};

//custom hook
export const useStateContext = () => useContext(StateContext);
