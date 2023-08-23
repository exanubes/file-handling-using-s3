import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

interface Props extends StackProps {

}

export class SimpleBucketStack extends Stack {
  constructor(app: Construct, id: string, props: Props) {
    super(app, id, props);
  }
}
